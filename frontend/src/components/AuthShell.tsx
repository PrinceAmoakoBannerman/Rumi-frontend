import type { InputHTMLAttributes, ReactNode } from 'react'
import { motion } from 'framer-motion'

/** The card the sign-in and sign-up forms sit in. */
export function AuthShell({
  darkMode, eyebrow, title, subtitle, children,
}: {
  darkMode: boolean
  eyebrow: string
  title: string
  subtitle: string
  children: ReactNode
}) {
  return (
    <div
      className={`min-h-screen pt-[196px] pb-24 px-6 flex justify-center ${
        darkMode ? 'bg-[#1C1916]' : 'bg-[#FAF7F2]'
      }`}
    >
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className={`w-full max-w-md h-fit rounded-3xl border p-8 sm:p-10 ${
          darkMode ? 'bg-[#252018] border-[#3A3328]' : 'bg-white border-[#F5EFE6]'
        }`}
        style={{ boxShadow: '0 20px 60px rgba(42,42,42,0.07)' }}
      >
        <p className="text-[#D3839E] text-xs tracking-[0.35em] uppercase font-medium mb-3">
          {eyebrow}
        </p>
        <h1
          style={{ fontFamily: 'var(--font-display)' }}
          className={`text-3xl font-medium mb-2 ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}
        >
          {title}
        </h1>
        <p className={`text-sm leading-relaxed mb-8 ${darkMode ? 'text-[#FAF7F2]/60' : 'text-[#4A4A4A]'}`}>
          {subtitle}
        </p>
        {children}
      </motion.div>
    </div>
  )
}

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  darkMode: boolean
  hint?: string
}

export function Field({ label, darkMode, hint, ...props }: FieldProps) {
  return (
    <label className="flex flex-col gap-1.5 min-w-0">
      <span
        className={`text-[10px] tracking-[0.15em] uppercase font-medium ${
          darkMode ? 'text-[#FAF7F2]/50' : 'text-[#4A4A4A]/70'
        }`}
      >
        {label}
      </span>
      <input
        {...props}
        className={`w-full min-w-0 bg-transparent border-b text-sm py-2 outline-none focus:border-[#D3839E] transition-colors ${
          darkMode
            ? 'border-[#3A3328] text-[#FAF7F2] placeholder-[#FAF7F2]/20'
            : 'border-[#EDE4D6] text-[#2A2A2A] placeholder-[#4A4A4A]/30'
        }`}
      />
      {hint && (
        <span className={`text-[11px] ${darkMode ? 'text-[#FAF7F2]/35' : 'text-[#4A4A4A]/50'}`}>
          {hint}
        </span>
      )}
    </label>
  )
}

export function SubmitButton({ busy, children }: { busy: boolean; children: ReactNode }) {
  return (
    <motion.button
      type="submit"
      disabled={busy}
      whileTap={busy ? undefined : { scale: 0.98 }}
      className="w-full mt-2 bg-[#D3839E] hover:bg-[#B85E75] disabled:bg-[#D3839E]/55 disabled:cursor-not-allowed text-white text-xs tracking-[0.2em] uppercase font-semibold py-4 rounded-full transition-colors"
    >
      {busy ? 'One moment…' : children}
    </motion.button>
  )
}
