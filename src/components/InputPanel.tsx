import PrefixQuickButtons from './PrefixQuickButtons'
import ValidationMessage from './ValidationMessage'

interface Props {
  input: string
  cidr: number
  error: string | null
  onInputChange: (value: string) => void
  onCidrChange: (cidr: number) => void
}

export default function InputPanel({ input, cidr, error, onInputChange, onCidrChange }: Props) {
  return (
    <div className="flex flex-col rounded border border-gray-800 bg-panel">
      {/* Panel header */}
      <div className="border-b border-gray-800 px-4 py-2.5">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-500">
          Input
        </span>
      </div>

      <div className="flex flex-col gap-5 p-4">
        {/* IP / CIDR input */}
        <div>
          <label
            htmlFor="cidr-input"
            className="mb-1.5 block text-[10px] font-medium uppercase tracking-widest text-gray-500"
          >
            IP Address / Prefix
          </label>
          <input
            id="cidr-input"
            type="text"
            value={input}
            onChange={e => onInputChange(e.target.value)}
            placeholder="192.168.1.10/24"
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            className={[
              'w-full rounded border bg-gray-900 px-3 py-2.5 font-mono text-sm text-gray-200',
              'placeholder-gray-600 outline-none transition-colors',
              'focus:ring-1',
              error
                ? 'border-red-500/60 focus:border-red-500/70 focus:ring-red-500/20'
                : 'border-gray-700 focus:border-cyan-400/50 focus:ring-cyan-400/15',
            ].join(' ')}
          />
          {error && <ValidationMessage message={error} />}
        </div>

        {/* Prefix slider */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="prefix-slider"
              className="text-[10px] font-medium uppercase tracking-widest text-gray-500"
            >
              Prefix length
            </label>
            <span className="font-mono text-sm font-bold text-cyan-400">/{cidr}</span>
          </div>
          <input
            id="prefix-slider"
            type="range"
            min={0}
            max={32}
            value={cidr}
            onChange={e => onCidrChange(Number(e.target.value))}
            className="w-full appearance-none"
          />
          {/* Scale markers */}
          <div className="mt-1 flex justify-between font-mono text-[9px] text-gray-700 select-none">
            {[0, 4, 8, 12, 16, 20, 24, 28, 32].map(n => (
              <span key={n}>{n}</span>
            ))}
          </div>
        </div>

        {/* Quick prefix buttons */}
        <PrefixQuickButtons currentCidr={cidr} onSelect={onCidrChange} />
      </div>
    </div>
  )
}
