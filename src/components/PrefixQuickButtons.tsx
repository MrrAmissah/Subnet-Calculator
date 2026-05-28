const QUICK_PREFIXES = [24, 25, 26, 27, 28, 29, 30, 31, 32] as const

interface Props {
  currentCidr: number
  onSelect: (cidr: number) => void
}

export default function PrefixQuickButtons({ currentCidr, onSelect }: Props) {
  return (
    <div>
      <p className="mb-1.5 text-[10px] font-medium uppercase tracking-widest text-fore-3">
        Quick select
      </p>
      <div className="flex flex-wrap gap-1.5">
        {QUICK_PREFIXES.map(prefix => (
          <button
            key={prefix}
            onClick={() => onSelect(prefix)}
            className={[
              'rounded border px-2 py-1 font-mono text-xs transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-signal/50',
              currentCidr === prefix
                ? 'border-signal/50 bg-signal/15 text-signal font-semibold'
                : 'border-edge-hi bg-raised text-fore-2 hover:border-signal/40 hover:bg-signal/8 hover:text-signal',
            ].join(' ')}
          >
            /{prefix}
          </button>
        ))}
      </div>
    </div>
  )
}
