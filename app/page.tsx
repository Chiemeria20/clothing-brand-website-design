'use client'

import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, Heart, Menu, Search, ShoppingBag, UserRound, X } from 'lucide-react'

const products = [
  { id: 1, name: 'The Everyday Trouser', category: 'Women', price: '₦38,000', image: '/women-woody-coord.png', tone: 'New in' },
  { id: 2, name: 'Classic Relaxed Denim', category: 'Men', price: '₦42,000', image: '/male-casual-shirt.png', tone: 'Bestseller' },
  { id: 3, name: 'Essential Scrub Set', category: 'Scrubs', price: '₦32,000', image: '/category-scrub.png', tone: 'Made for long days' },
  { id: 4, name: 'The Soft Structure Blazer', category: 'Women', price: '₦58,000', image: '/brand-hero.png', tone: 'Limited' },
  { id: 5, name: 'The Boardroom Set', category: 'Men', price: '₦68,000', image: '/male-corporate.png', tone: 'Refined' },
  { id: 6, name: 'The Off-Duty Hoodie Set', category: 'Men', price: '₦52,000', image: '/male-hoodie-pants.png', tone: 'New in' },
  { id: 7, name: 'The Woody Co-ord', category: 'Men', price: '₦61,000', image: '/male-woodies-pants.png', tone: 'Limited' },
  { id: 8, name: 'The Short-Sleeve Zip Classic', category: 'Men', price: '₦55,000', image: '/male-short-sleeve-brown.png', tone: 'New in' },
  { id: 9, name: 'The Denim & Form Set', category: 'Women', price: '₦49,000', image: '/women-baggy-denim.png', tone: 'Bestseller' },
  { id: 10, name: 'The Easy Corporate Edit', category: 'Women', price: '₦56,000', image: '/women-body-hug-corporate.png', tone: 'Refined' },
  { id: 11, name: 'The Tie Skirt Set', category: 'Women', price: '₦44,000', image: '/women-skirt-tie.png', tone: 'New in' },
  { id: 12, name: 'The RoyalJ Everyday Set', category: 'Men', price: '₦48,000', image: '/category-men.png', tone: 'Signature' },
  { id: 13, name: 'The No-Suit Office Edit', category: 'Women', price: '₦59,000', image: '/women-corporate-no-suit.png', tone: 'New in' },
  { id: 14, name: 'The Gen Z Denim Edit', category: 'Women', price: '₦52,000', image: '/women-baggy-denim.png', tone: 'Signature' },
  { id: 15, name: 'The Premium Everyday Set', category: 'Men', price: '₦54,000', image: '/male-premium-looks.png', tone: 'New in' },
  { id: 16, name: 'The Tailored Sand Edit', category: 'Women', price: '₦57,000', image: '/women-premium-looks.png', tone: 'Signature' },
  { id: 17, name: 'Navy Essential Scrub Set', category: 'Scrubs', price: '₦34,000', image: '/scrub-navy.png', tone: 'New in' },
  { id: 18, name: 'Wine Utility Scrub Set', category: 'Scrubs', price: '₦36,000', image: '/scrub-wine.png', tone: 'Refined' },
  { id: 19, name: 'Sage Wrap Scrub Set', category: 'Scrubs', price: '₦35,000', image: '/scrub-sage.png', tone: 'Bestseller' },
  { id: 20, name: 'Sky Blue Comfort Scrub', category: 'Scrubs', price: '₦33,000', image: '/scrub-sky.png', tone: 'Made for long days' },
  { id: 21, name: 'The Blush Street Set', category: 'Women', price: '₦52,000', image: '/women-pink-coord-reference.jpg', tone: 'New in' },
  { id: 22, name: 'The Soft Lounge Edit', category: 'Women', price: '₦46,000', image: '/women-wardrobe-reference.jpg', tone: 'Everyday ease' },
  { id: 23, name: 'The Grey Wide-Leg Set', category: 'Men', price: '₦50,000', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20261003-WA0023-aGj1h6VdYUVl63LNjPSyyJsECC3kkL.jpg', tone: 'New in' },
  { id: 24, name: 'The Charcoal Hoodie Set', category: 'Men', price: '₦54,000', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20261003-WA0024-vE1wMJFfOJEaTrfWDWcqAVhyGuugoE.jpg', tone: 'Everyday ease' },
  ]

const categories = [
  { name: 'Women', label: 'Quiet confidence', image: '/category-women-genz.png' },
  { name: 'Men', label: 'Everyday distinction', image: '/category-men.png' },
  { name: 'Scrubs', label: 'Made for long days', image: '/category-scrub.png' },
]

export default function Page() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [cart, setCart] = useState<number[]>([])
  const [menuOpen, setMenuOpen] = useState(false)
  const [liked, setLiked] = useState<number[]>([])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const productId = Number(params.get('product'))
    const linkedProduct = products.find((product) => product.id === productId)

    if (!linkedProduct) return

    setActiveCategory(linkedProduct.category)
    window.requestAnimationFrame(() => {
      document.getElementById(`product-${linkedProduct.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
  }, [])

  const filteredProducts = useMemo(() => activeCategory === 'All' ? products : products.filter((product) => product.category === activeCategory), [activeCategory])
  const cartProducts = useMemo(() => products.filter((product) => cart.includes(product.id)), [cart])
  const productUrl = (product: (typeof products)[number]) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://royalj.vercel.app'
    return `${origin}/?category=${encodeURIComponent(product.category)}&product=${product.id}#products`
  }
  const whatsappLink = (product: (typeof products)[number]) => `https://wa.me/2348060465453?text=${encodeURIComponent(`Hi, I want to purchase this ${product.name} (${product.price}). Is it available?

Product link: ${productUrl(product)}
Product image: ${typeof window !== 'undefined' ? `${window.location.origin}${product.image}` : product.image}`)}`

  return (
    <main className="min-h-screen bg-[#f7f5f1] text-[#1d2724]">
      <div className="bg-[#1d2724] px-4 py-2 text-center text-[10px] font-medium uppercase tracking-[0.18em] text-[#f5efe5]">Thoughtfully made. Easily yours. Shop via WhatsApp.</div>
      <header className="relative mx-auto flex max-w-[1440px] items-center justify-between px-5 py-5 md:px-10 lg:py-7">
        <button className="lg:hidden" aria-label="Open menu" onClick={() => setMenuOpen(true)}><Menu /></button>
        <a href="#top" className="font-serif text-2xl font-semibold tracking-[-0.06em] md:text-3xl">RoyalJ<span className="text-[#c9734a]">.</span></a>
        <nav className="hidden items-center gap-9 text-[11px] font-semibold uppercase tracking-[0.16em] lg:flex">
          {['Women', 'Men', 'Scrubs', 'Our story'].map((item) => <a key={item} href={item === 'Our story' ? '#story' : '#shop'}>{item}</a>)}
        </nav>
        <div className="flex items-center gap-4">
          <button aria-label="Search"><Search className="size-[18px]" strokeWidth={1.6} /></button>
          <button aria-label="Account" className="hidden md:block"><UserRound className="size-[18px]" strokeWidth={1.6} /></button>
          <button aria-label={`Shopping bag with ${cart.length} items`} className="relative" onClick={() => document.getElementById('cart')?.scrollIntoView({ behavior: 'smooth' })}><ShoppingBag className="size-[18px]" strokeWidth={1.6} />{cart.length > 0 && <span className="absolute -right-2 -top-2 flex size-4 items-center justify-center rounded-full bg-[#c9734a] text-[9px] text-white">{cart.length}</span>}</button>
        </div>
      </header>
      {menuOpen && <div className="fixed inset-0 z-20 bg-[#f7f5f1] p-6 lg:hidden"><div className="flex justify-end"><button aria-label="Close menu" onClick={() => setMenuOpen(false)}><X /></button></div><nav className="mt-20 flex flex-col gap-8 font-serif text-5xl"><a href="#shop" onClick={() => setMenuOpen(false)}>Women</a><a href="#shop" onClick={() => setMenuOpen(false)}>Men</a><a href="#shop" onClick={() => setMenuOpen(false)}>Scrubs</a><a href="#story" onClick={() => setMenuOpen(false)}>Our story</a></nav></div>}

      <section id="top" className="mx-auto grid max-w-[1440px] gap-4 px-5 pb-8 md:px-10 lg:grid-cols-[1.08fr_.92fr] lg:gap-6 lg:pb-16">
        <div className="flex min-h-[470px] flex-col justify-between bg-[#d9dfd5] p-7 md:min-h-[600px] md:p-12 lg:p-16">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#53635b]">The new everyday</p>
          <div><h1 className="max-w-xl font-serif text-[clamp(3.9rem,8vw,8rem)] leading-[0.87] tracking-[-0.07em]">Clothes<br /><em className="font-light">with a point</em><span className="text-[#c9734a]">.</span></h1><p className="mt-8 max-w-xs text-sm leading-6 text-[#53635b]">Classic pieces, considered details, and a little room to be entirely yourself.</p><a href="#shop" className="mt-7 inline-flex items-center gap-3 border-b border-[#1d2724] pb-2 text-[11px] font-semibold uppercase tracking-[0.18em]">Explore the edit <ArrowRight className="size-4" /></a></div>
        </div>
        <div className="relative min-h-[470px] overflow-hidden md:min-h-[600px]"><img src="/brand-hero.png" alt="Model wearing a cream blazer from the new collection" className="absolute inset-0 size-full object-cover" /><div className="absolute bottom-6 left-6 text-white md:bottom-10 md:left-10"><p className="text-[10px] uppercase tracking-[0.2em]">Collection 01 / 26</p><p className="mt-2 font-serif text-3xl">Soft structure</p></div></div>
      </section>

      <section id="shop" className="mx-auto max-w-[1440px] px-5 py-12 md:px-10 md:py-20"><div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#c9734a]">Find your fit</p><h2 className="mt-3 font-serif text-5xl tracking-[-0.06em] md:text-6xl">Shop by category</h2></div><div className="flex gap-5 border-b border-[#cfd1ca] text-[11px] font-semibold uppercase tracking-[0.15em]"><button className={`pb-3 ${activeCategory === 'All' ? 'border-b-2 border-[#1d2724]' : 'text-[#7b837d]'}`} onClick={() => setActiveCategory('All')}>All</button>{['Women','Men','Scrubs'].map((category) => <button key={category} className={`pb-3 ${activeCategory === category ? 'border-b-2 border-[#1d2724]' : 'text-[#7b837d]'}`} onClick={() => setActiveCategory(category)}>{category}</button>)}</div></div>
        <div className="mt-8 grid gap-3 md:grid-cols-3">{categories.map((category) => <a href="#products" key={category.name} onClick={() => setActiveCategory(category.name)} className="group relative min-h-[340px] overflow-hidden bg-[#d9dfd5]"><img src={category.image} alt={`${category.name} collection`} className="absolute inset-0 size-full object-cover transition duration-500 group-hover:scale-105" /><div className="absolute inset-0 bg-black/10" /><div className="absolute bottom-6 left-6 text-white"><p className="text-[10px] uppercase tracking-[0.2em]">{category.label}</p><h3 className="mt-1 font-serif text-4xl">{category.name}</h3></div><ArrowRight className="absolute bottom-6 right-6 text-white" /></a>)}</div>
      </section>

      <section id="products" className="mx-auto max-w-[1440px] px-5 pb-16 md:px-10 md:pb-28"><div className="flex items-center justify-between border-t border-[#d7d8d2] pt-8"><h2 className="font-serif text-4xl tracking-[-0.05em]">The edit <span className="font-sans text-sm text-[#7b837d]">({filteredProducts.length})</span></h2><p className="hidden text-[10px] uppercase tracking-[0.16em] text-[#7b837d] md:block">Tap a piece to make it yours</p></div><div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-4">{filteredProducts.map((product) => <article id={`product-${product.id}`} key={product.id} className="group scroll-mt-8"><div className="relative aspect-[.78] overflow-hidden bg-[#e6e5df]"><img src={product.image} alt={product.name} className="size-full object-cover transition duration-500 group-hover:scale-105" /><button aria-label={`Save ${product.name}`} onClick={() => setLiked((current) => current.includes(product.id) ? current.filter((id) => id !== product.id) : [...current, product.id])} className="absolute right-3 top-3 rounded-full bg-[#f7f5f1]/90 p-2"><Heart className={`size-4 ${liked.includes(product.id) ? 'fill-[#c9734a] text-[#c9734a]' : ''}`} strokeWidth={1.5} /></button><span className="absolute bottom-3 left-3 bg-[#f7f5f1]/90 px-2 py-1 text-[9px] uppercase tracking-[0.14em]">{product.tone}</span></div><div className="flex items-start justify-between gap-2 pt-4"><div><p className="font-serif text-lg leading-tight">{product.name}</p><p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-[#7b837d]">{product.category} · {product.price}</p></div><button aria-label={`Add ${product.name} to bag`} onClick={() => setCart((current) => current.includes(product.id) ? current : [...current, product.id])} className="mt-1 text-[10px] font-semibold uppercase tracking-[0.1em] underline underline-offset-4">Add</button></div><a href={whatsappLink(product)} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.13em] text-[#c9734a]">Purchase via WhatsApp <ArrowRight className="size-3" /></a></article>)}</div></section>

      <section id="cart" className="mx-auto max-w-[1440px] px-5 pb-16 md:px-10 md:pb-24"><div className="border-t border-[#d7d8d2] pt-8"><div className="flex items-end justify-between gap-4"><div><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#c9734a]">Your selection</p><h2 className="mt-2 font-serif text-4xl tracking-[-0.05em]">Your bag <span className="font-sans text-sm text-[#7b837d]">({cartProducts.length})</span></h2></div>{cartProducts.length > 0 && <button onClick={() => setCart([])} className="text-[10px] font-semibold uppercase tracking-[0.14em] underline underline-offset-4">Clear bag</button>}</div>{cartProducts.length > 0 ? <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{cartProducts.map((product) => <div key={product.id} className="flex gap-4 bg-[#e8e6df] p-3"><img src={product.image} alt={product.name} className="size-24 object-cover" /><div className="flex min-w-0 flex-1 flex-col justify-between py-1"><div><p className="font-serif text-lg leading-tight">{product.name}</p><p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-[#7b837d]">{product.price}</p></div><div className="flex items-center justify-between gap-3"><button onClick={() => setCart((current) => current.filter((id) => id !== product.id))} className="text-[10px] uppercase tracking-[0.12em] underline underline-offset-4">Remove</button><a href={whatsappLink(product)} target="_blank" rel="noreferrer" className="text-[10px] font-semibold uppercase tracking-[0.1em]">Purchase</a></div></div></div>)}</div> : <p className="mt-6 text-sm text-[#7b837d]">Your bag is empty. Add a piece from the edit to see it here.</p>}</div></section>

      <section id="story" className="bg-[#1d2724] px-5 py-16 text-[#f7f5f1] md:px-10 md:py-24"><div className="mx-auto grid max-w-[1200px] gap-10 md:grid-cols-[.8fr_1.2fr] md:items-end"><p className="text-[10px] uppercase tracking-[0.2em] text-[#d9dfd5]">Why RoyalJ</p><div><p className="font-serif text-4xl leading-[1.05] tracking-[-0.05em] md:text-6xl">For the days you&apos;re becoming, and the ones you already are.</p><p className="mt-7 max-w-md text-sm leading-6 text-[#bec8bd]">We make wardrobe foundations with presence. Designed to move between your real life, from first coffee to final rounds.</p></div></div></section>
      <footer id="site-footer" className="mx-auto flex max-w-[1440px] flex-col gap-5 px-5 py-8 text-[10px] uppercase tracking-[0.14em] text-[#7b837d] md:flex-row md:items-center md:justify-between md:px-10"><p>© 2026 RoyalJ studio</p><p>{cart.length ? `${cart.length} item${cart.length > 1 ? 's' : ''} saved to your bag` : 'Your bag is empty — add something you love'}</p><a href="https://wa.me/2348060465453?text=Hi%20RoyalJ%2C%20I%27d%20like%20to%20shop%20the%20collection." target="_blank" rel="noreferrer" className="text-[#1d2724] underline underline-offset-4">Chat with us on WhatsApp</a></footer>
    </main>
  )
}
