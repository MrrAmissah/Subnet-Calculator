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
    <div className="flex flex-col rounded border border-edge bg-panel">
      <div className="border-b border-edge px-4 py-2.5">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-fore-3">
          Input
        </span>
      </div>

      <div className="flex flex-col gap-5 p-4">
        {/* IP / CIDR field */}
        <div>
          <label
            htmlFor="cidr-input"
            className="mb-1.5 block text-[10px] font-medium uppercase tracking-widest text-fore-3"
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
              'w-full rounded border bg-raised px-3 py-2.5 font-mono text-sm text-fore',
              'placeholder-fore-3 outline-none transition-colors',
              'focus:ring-1',
              error
                ? 'border-fail/60 focus:border-fail/70 focus:ring-fail/20'
                : 'border-edge-hi focus:border-signal/50 focus:ring-signal/15',
            ].join(' ')}
          />
          {error && <ValidationMessage message={error} />}
        </div>

        {/* Prefix slider */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="prefix-slider"
              className="text-[10px] font-medium uppercase tracking-widest text-fore-3"
            >
              Prefix length
            </label>
            <span className="font-mono text-sm font-bold text-signal">/{cidr}</span>
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
          <div className="mt-1 flex justify-between font-mono text-[9px] text-fore-3 select-none">
            {[0, 4, 8, 12, 16, 20, 24, 28, 32].map(n => (
              <span key={n}>{n}</span>
            ))}
          </div>
        </div>

        <PrefixQuickButtons currentCidr={cidr} onSelect={onCidrChange} />
      </div>
    </div>
  )
}
