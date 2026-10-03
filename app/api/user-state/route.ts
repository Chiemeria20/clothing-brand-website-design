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
  const body = await request.json() as { cart?: number[]; favorites?: number[] }
  if (body.cart) {
    await db.delete(cartItem).where(eq(cartItem.userId, userId))
    if (body.cart.length) await db.insert(cartItem).values(body.cart.map((productId) => ({ id: crypto.randomUUID(), userId, productId })))
  }
  if (body.favorites) {
    await db.delete(savedItem).where(eq(savedItem.userId, userId))
    if (body.favorites.length) await db.insert(savedItem).values(body.favorites.map((productId) => ({ id: crypto.randomUUID(), userId, productId })))
  }
  return NextResponse.json({ ok: true })
}
