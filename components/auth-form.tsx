'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'

export function AuthForm({ mode }: { mode: 'sign-in' | 'sign-up' }) {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const isSignUp = mode === 'sign-up'

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')
    const data = new FormData(event.currentTarget)
    try {
      const result = isSignUp
        ? await authClient.signUp.email({ name: String(data.get('name')).trim(), email: String(data.get('email')).trim().toLowerCase(), password: String(data.get('password')) })
        : await authClient.signIn.email({ email: String(data.get('email')).trim().toLowerCase(), password: String(data.get('password')) })
      if (result.error) {
        const code = result.error.code
        const message = String(result.error.message || '').toLowerCase()
        setError(code === 'USER_ALREADY_EXISTS' || code === 'email_exists' || message.includes('already exist') ? 'An account already exists with this email. Try signing in instead.' : code === 'INVALID_PASSWORD' || code === 'INVALID_EMAIL_OR_PASSWORD' ? 'The email or password is incorrect. Please try again.' : message.includes('origin') ? 'This deployment is not configured for account access yet. Please open the latest deployment and try again.' : isSignUp ? 'We could not create your account. Check your details and try again.' : 'The email or password is incorrect. Please try again.')
        return
      }
      const params = new URLSearchParams(window.location.search)
      const pending = params.get('pending')
      const action = params.get('action')
      router.replace(pending && action ? `/?pending=${pending}&action=${action}` : '/')
    } catch (authError) {
      console.error('[v0] Authentication request failed:', authError)
      setError('We could not reach the account service. Please refresh the page and try again.')
    } finally {
      setLoading(false)
    }
  }

  return <main className="flex min-h-screen items-center justify-center bg-[#f7f5f1] px-5"><form onSubmit={handleSubmit} className="w-full max-w-md rounded-3xl bg-[#e8e6df] p-7 md:p-10"><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#c9734a]">RoyalJ account</p><h1 className="mt-3 font-serif text-4xl">{isSignUp ? 'Save your collection' : 'Welcome back'}</h1><p className="mt-3 text-sm leading-6 text-[#66706a]">{isSignUp ? 'Create an account to keep your bag and favorites across visits.' : 'Sign in to restore your bag and favorites.'}</p><div className="mt-8 grid gap-4">{isSignUp && <input required name="name" placeholder="Full name" className="border-b border-[#aeb5ad] bg-transparent px-0 py-3 outline-none" />}<input required name="email" type="email" placeholder="Email address" className="border-b border-[#aeb5ad] bg-transparent px-0 py-3 outline-none" /><input required name="password" type="password" minLength={8} placeholder="Password" className="border-b border-[#aeb5ad] bg-transparent px-0 py-3 outline-none" /></div>{error && <p role="alert" className="mt-4 text-sm text-[#b44f3d]">{error}</p>}<button disabled={loading} className="mt-8 w-full bg-[#1d2724] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#f7f5f1]">{loading ? 'Please wait…' : isSignUp ? 'Create account' : 'Sign in'}</button><a href={isSignUp ? '/sign-in' : '/sign-up'} className="mt-5 block text-center text-xs underline underline-offset-4">{isSignUp ? 'Already have an account? Sign in' : 'New to RoyalJ? Create an account'}</a></form></main>
}
