import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { cartItem, favorite } from '@/lib/db/schema'

async function userId() { return (await auth.api.getSession({ headers: await headers() }))?.user?.id }
export async function GET() { const id = await userId(); if (!id) return NextResponse.json({ authenticated: false }); const [cart, favorites] = await Promise.all([db.select({ productId: cartItem.productId }).from(cartItem).where(eq(cartItem.userId, id)), db.select({ productId: favorite.productId }).from(favorite).where(eq(favorite.userId, id))]); return NextResponse.json({ authenticated: true, cart: cart.map((item) => item.productId), favorites: favorites.map((item) => item.productId) }) }
export async function POST(request: Request) { const id = await userId(); if (!id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); const body = await request.json() as { cart?: number[]; favorites?: number[] }; const cart = [...new Set((body.cart ?? []).filter(Number.isInteger))]; const favorites = [...new Set((body.favorites ?? []).filter(Number.isInteger))]; await db.transaction(async (tx) => { await tx.delete(cartItem).where(eq(cartItem.userId, id)); await tx.delete(favorite).where(eq(favorite.userId, id)); if (cart.length) await tx.insert(cartItem).values(cart.map((productId) => ({ id: crypto.randomUUID(), userId: id, productId, quantity: 1 }))); if (favorites.length) await tx.insert(favorite).values(favorites.map((productId) => ({ id: crypto.randomUUID(), userId: id, productId }))) }); return NextResponse.json({ ok: true }) }
