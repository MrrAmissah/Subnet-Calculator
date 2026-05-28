import ResultCard, { type ResultCardProps } from './ResultCard'

interface Props {
  title: string
  items: ResultCardProps[]
}

export default function DetailSection({ title, items }: Props) {
  return (
    <div className="rounded border border-gray-800 bg-panel">
      <div className="border-b border-gray-800 px-4 py-2.5">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-500">
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
