import { useState } from 'react'

interface Props {
  label: string
  value: string
  mono?: boolean
  badge?: string
  badgeVariant?: 'green' | 'blue' | 'orange'
}

export default function ResultCard({ label, value, mono = false, badge, badgeVariant = 'blue' }: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const badgeColors = {
    green: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    blue: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
    orange: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  }

  return (
    <div className="result-card group relative flex flex-col gap-1 rounded-xl border border-white/8 bg-white/4 px-4 py-3 transition hover:border-white/15 hover:bg-white/6">
      <span className="text-xs font-medium tracking-wider text-slate-400 uppercase">{label}</span>
      <div className="flex items-center justify-between gap-2">
        <span className={`text-sm font-semibold text-slate-100 break-all ${mono ? 'font-mono' : ''}`}>
          {value}
        </span>
        <button
          onClick={handleCopy}
          title="Copy to clipboard"
          className="ml-auto shrink-0 rounded-md p-1.5 text-slate-500 opacity-0 transition group-hover:opacity-100 hover:bg-white/8 hover:text-slate-300 focus:opacity-100 focus:outline-none"
          aria-label={`Copy ${label}`}
        >
          {copied ? (
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-emerald-400">
              <path d="M3 8l3.5 3.5L13 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <rect x="5" y="1" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <path d="M1 5h3v10h10v-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
      </div>
      {badge && (
        <span className={`self-start rounded-full border px-2 py-0.5 text-xs font-medium ${badgeColors[badgeVariant]}`}>
          {badge}
        </span>
      )}
    </div>
  )
}
