import { useState, useEffect } from 'react'

type Theme = 'dark' | 'light'

function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const stored = localStorage.getItem('subnet-theme')
      if (stored === 'light' || stored === 'dark') return stored
    } catch {}
    return 'dark'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try { localStorage.setItem('subnet-theme', theme) } catch {}
  }, [theme])

  return { theme, toggle: () => setTheme(t => (t === 'dark' ? 'light' : 'dark')) }
}

function SunIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.4" />
      <line x1="8" y1="1" x2="8" y2="3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="8" y1="13" x2="8" y2="15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="1" y1="8" x2="3" y2="8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="13" y1="8" x2="15" y2="8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="3.05" y1="3.05" x2="4.46" y2="4.46" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="11.54" y1="11.54" x2="12.95" y2="12.95" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="12.95" y1="3.05" x2="11.54" y2="4.46" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="4.46" y1="11.54" x2="3.05" y2="12.95" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M13.5 10.5A6 6 0 015.5 2.5a6 6 0 100 11 6 6 0 008-3z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function Header() {
  const { theme, toggle } = useTheme()

  return (
    <header className="border-b border-edge bg-panel">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded border border-signal/20 bg-signal/8">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-signal">
              <circle cx="9" cy="9" r="2" fill="currentColor" />
              <circle cx="2.5" cy="3.5" r="1.75" stroke="currentColor" strokeWidth="1.1" />
              <circle cx="15.5" cy="3.5" r="1.75" stroke="currentColor" strokeWidth="1.1" />
              <circle cx="2.5" cy="14.5" r="1.75" stroke="currentColor" strokeWidth="1.1" />
              <circle cx="15.5" cy="14.5" r="1.75" stroke="currentColor" strokeWidth="1.1" />
              <line x1="4.2" y1="4.6" x2="7.3" y2="7.6" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
              <line x1="13.8" y1="4.6" x2="10.7" y2="7.6" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
              <line x1="4.2" y1="13.4" x2="7.3" y2="10.4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
              <line x1="13.8" y1="13.4" x2="10.7" y2="10.4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-fore-3">
              IPv4 / CIDR Utility
            </p>
            <h1 className="text-sm font-semibold leading-tight text-fore">
              Subnet Calculator
            </h1>
            <p className="mt-0.5 text-[11px] leading-tight text-fore-3">
              Calculate network ranges, masks, host capacity, and CIDR details instantly
            </p>
          </div>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-1.5 rounded border border-ok/25 bg-ok/8 px-2.5 py-1 text-[11px] font-medium text-ok sm:flex">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ok" />
            Live calculation
          </span>
          <button
            onClick={toggle}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className="flex h-8 w-8 items-center justify-center rounded border border-edge text-fore-3 transition-colors hover:border-edge-hi hover:bg-raised hover:text-fore focus:outline-none focus-visible:ring-1 focus-visible:ring-signal/50"
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </div>
    </header>
  )
}
