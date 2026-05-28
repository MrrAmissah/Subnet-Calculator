import CopyButton from './CopyButton'

export interface ResultCardProps {
  label: string
  value: string
  mono?: boolean
  copyable?: boolean
}

export default function ResultCard({ label, value, mono = false, copyable = false }: ResultCardProps) {
  return (
    <div className="group flex items-start justify-between gap-3 border-t border-edge/70 py-2 first:border-0">
      <span className="shrink-0 pt-px text-[10px] font-medium uppercase tracking-widest text-fore-3">
        {label}
      </span>
      <div className="flex items-center gap-1.5">
        <span className={`text-right text-sm leading-snug text-fore ${mono ? 'font-mono' : ''}`}>
          {value}
        </span>
        {copyable && <CopyButton value={value} />}
      </div>
    </div>
  )
}
