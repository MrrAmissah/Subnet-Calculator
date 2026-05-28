export default function Header() {
  return (
    <header className="border-b border-gray-800 bg-panel">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          {/* Network graph icon */}
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded border border-cyan-400/20 bg-cyan-400/8">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-cyan-400">
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
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500">
              IPv4 / CIDR Utility
            </p>
            <h1 className="text-sm font-semibold leading-tight text-gray-200">
              Subnet Calculator
            </h1>
            <p className="text-[11px] text-gray-500 leading-tight mt-0.5">
              Calculate network ranges, masks, host capacity, and CIDR details instantly
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded border border-green-500/25 bg-green-500/8 px-2.5 py-1 text-[11px] font-medium text-green-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
            Live calculation
          </span>
        </div>
      </div>
    </header>
  )
}
