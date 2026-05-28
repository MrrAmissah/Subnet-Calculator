import ResultCard, { type ResultCardProps } from './ResultCard'

type Color = 'signal' | 'ok' | 'warn' | 'info'

const HEADER = {
  signal: 'bg-signal',
  ok:     'bg-ok',
  warn:   'bg-warn',
  info:   'bg-info',
}

interface Props {
  title: string
  items: ResultCardProps[]
  color?: Color
}

export default function DetailSection({ title, items, color }: Props) {
  const headerBg = color ? HEADER[color] : null

  return (
    <div className="overflow-hidden rounded border border-edge bg-panel">
      <div className={['border-b border-black/10 px-4 py-2.5', headerBg ?? 'border-edge bg-panel'].join(' ')}>
        <span className={['text-[10px] font-semibold uppercase tracking-widest', headerBg ? 'text-canvas' : 'text-fore-3'].join(' ')}>
          {title}
        </span>
      </div>
      <div className="px-4 pb-2 pt-1">
        {items.map((item, i) => (
          <ResultCard key={i} {...item} />
        ))}
      </div>
    </div>
  )
}
