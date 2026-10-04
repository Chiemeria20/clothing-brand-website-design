import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { and, eq } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { cartItem, savedItem } from '@/lib/db/schema'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return null
  return session.user.id
}

export async function GET() {
  const userId = await getUserId()
  if (!userId) return NextResponse.json({ authenticated: false, cart: [], favorites: [] })
  const [cart, favorites] = await Promise.all([
    db.select({ productId: cartItem.productId }).from(cartItem).where(eq(cartItem.userId, userId)),
    db.select({ productId: savedItem.productId }).from(savedItem).where(eq(savedItem.userId, userId)),
  ])
  return NextResponse.json({ authenticated: true, cart: cart.map((item) => item.productId), favorites: favorites.map((item) => item.productId) })
}

export async function PUT(request: Request) {
  const userId = await getUserId()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await request.json() as { cart?: unknown; favorites?: unknown }
  const cart = Array.isArray(body.cart) ? [...new Set(body.cart.filter((value): value is number => Number.isInteger(value) && value > 0))] : undefined
  const favorites = Array.isArray(body.favorites) ? [...new Set(body.favorites.filter((value): value is number => Number.isInteger(value) && value > 0))] : undefined
  if (cart) {
    await db.delete(cartItem).where(eq(cartItem.userId, userId))
    if (cart.length) await db.insert(cartItem).values(cart.map((productId) => ({ id: crypto.randomUUID(), userId, productId })))
  }
  if (favorites) {
    await db.delete(savedItem).where(eq(savedItem.userId, userId))
    if (favorites.length) await db.insert(savedItem).values(favorites.map((productId) => ({ id: crypto.randomUUID(), userId, productId })))
  }
  return NextResponse.json({ ok: true })
}
