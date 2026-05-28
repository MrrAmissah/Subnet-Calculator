const QUICK_PREFIXES = [24, 25, 26, 27, 28, 29, 30, 31, 32] as const

interface Props {
  currentCidr: number
  onSelect: (cidr: number) => void
}

export default function PrefixQuickButtons({ currentCidr, onSelect }: Props) {
  return (
    <div>
      <p className="mb-1.5 text-[10px] font-medium uppercase tracking-widest text-gray-500">
        Quick select
      </p>
      <div className="flex flex-wrap gap-1.5">
        {QUICK_PREFIXES.map(prefix => (
          <button
            key={prefix}
            onClick={() => onSelect(prefix)}
            className={[
              'rounded border px-2 py-1 font-mono text-xs transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400/50',
              currentCidr === prefix
                ? 'border-cyan-400/40 bg-cyan-400/10 text-cyan-400'
                : 'border-gray-700 bg-gray-900 text-gray-400 hover:border-gray-600 hover:text-gray-300',
            ].join(' ')}
          >
            /{prefix}
          </button>
        ))}
      </div>
    </div>
  )
}
