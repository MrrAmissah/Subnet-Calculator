import CopyButton from './CopyButton'

export interface ResultCardProps {
  label: string
  value: string
  mono?: boolean
  copyable?: boolean
}

export default function ResultCard({ label, value, mono = false, copyable = false }: ResultCardProps) {
  return (
    <div className="group flex flex-wrap items-center gap-x-3 gap-y-0.5 border-t border-edge/70 py-2 first:border-0 transition-colors hover:bg-raised -mx-4 px-4">
      <span className="grow text-[10px] font-medium uppercase tracking-widest text-fore-3">
        {label}
      </span>
      <div className="flex items-center gap-1.5">
        <span className={`text-right text-sm leading-snug text-fore ${mono ? 'font-mono' : ''}`} title={value}>
          {value}
        </span>
        {copyable && (
          <span className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100">
            <CopyButton value={value} />
          </span>
        )}
      </div>
    </div>
  )
}
