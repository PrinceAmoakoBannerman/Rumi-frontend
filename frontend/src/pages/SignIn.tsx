import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiLock } from 'react-icons/fi'
import { useApp } from '../contexts/AppContext'
import { signIn, signUp, AuthError } from '../lib/auth'
import { AuthShell, Field, SubmitButton } from '../components/AuthShell'

/**
 * Signing in and joining, on one page.
 *
 * Both are the same short form with one extra field, and a shopper who picks
 * the wrong one should not have to go looking for the other.
 */
export default function SignIn({ joining = false }: { joining?: boolean }) {
  const { darkMode, setAccount } = useApp()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  // Where to go afterwards — checkout sends people here mid-purchase.
  const next = params.get('next') || '/account'

  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (busy) return
    setError(null)
    setBusy(true)

    const form = new FormData(e.currentTarget)
    const email = String(form.get('email') ?? '').trim()
    const password = String(form.get('password') ?? '')

    try {
      const account = joining
        ? await signUp({
            name: String(form.get('name') ?? '').trim(),
            email,
            password,
            phone: String(form.get('phone') ?? '').trim(),
          })
        : await signIn(email, password)
      setAccount(account)
      navigate(next, { replace: true })
    } catch (err) {
      setError(err instanceof AuthError ? err.message : 'Something went wrong. Please try again.')
      setBusy(false)
    }
  }

  return (
    <AuthShell
      darkMode={darkMode}
      eyebrow={joining ? 'Join GLOWWITHRUMI' : 'Welcome back'}
      title={joining ? 'Create your account' : 'Sign in'}
      subtitle={
        joining
          ? 'So your details are already filled in next time, and you can look back at what you ordered.'
          : 'Pick up where you left off.'
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {joining && (
          <Field label="Full name" name="name" autoComplete="name" darkMode={darkMode} required />
        )}
        <Field label="Email" name="email" type="email" autoComplete="email" darkMode={darkMode} required />
        {joining && (
          <Field label="Phone number" name="phone" type="tel" autoComplete="tel" darkMode={darkMode} />
        )}
        <Field
          label="Password"
          name="password"
          type="password"
          autoComplete={joining ? 'new-password' : 'current-password'}
          darkMode={darkMode}
          required
          minLength={joining ? 8 : undefined}
          hint={joining ? 'At least 8 characters.' : undefined}
        />

        {error && (
          <p
            role="alert"
            className="text-sm leading-relaxed text-[#C0392B] bg-[#C0392B]/8 border border-[#C0392B]/25 rounded-xl px-4 py-3"
          >
            {error}
          </p>
        )}

        <SubmitButton busy={busy}>
          {joining ? 'Create account' : 'Sign in'}
        </SubmitButton>

        <p className={`text-xs text-center ${darkMode ? 'text-[#FAF7F2]/50' : 'text-[#4A4A4A]/70'}`}>
          {joining ? 'Already have an account? ' : 'New here? '}
          <Link
            to={joining ? `/signin?next=${encodeURIComponent(next)}` : `/signup?next=${encodeURIComponent(next)}`}
            className="text-[#D3839E] font-medium hover:underline"
          >
            {joining ? 'Sign in' : 'Create one'}
          </Link>
        </p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`flex items-center justify-center gap-2 text-[11px] ${darkMode ? 'text-[#FAF7F2]/35' : 'text-[#4A4A4A]/50'}`}
        >
          <FiLock size={11} /> You can always check out without an account.
        </motion.p>
      </form>
    </AuthShell>
  )
}
