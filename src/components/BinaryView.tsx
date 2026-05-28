import type { SubnetResult } from '../lib/subnet'

interface Props {
  result: SubnetResult
}

function BinaryRow({
  label,
  value,
  cidr,
}: {
  label: string
  value: string
  cidr?: number
}) {
  const parts = value.split('.')
  let globalIdx = 0

  return (
    <tr className="border-t border-edge/70 first:border-0">
      <td className="whitespace-nowrap py-2.5 pr-6 align-middle">
        <span className="text-[10px] font-medium uppercase tracking-widest text-fore-3">
          {label}
        </span>
      </td>
      <td className="py-2.5 align-middle">
        <div className="flex items-center gap-px font-mono text-xs leading-none">
          {parts.map((octet, oi) => (
            <span key={oi} className="flex items-center gap-px">
              {octet.split('').map(bit => {
                const idx = globalIdx++
                const isNetwork = cidr !== undefined && idx < cidr
                return (
                  <span
                    key={idx}
                    className={[
                      'inline-flex h-[18px] w-[12px] items-center justify-center rounded-[2px] font-bold',
                      isNetwork
                        ? 'bg-signal/15 text-signal'
                        : bit === '1'
                          ? 'bg-edge/60 text-fore-2'
                          : 'text-fore-3',
                    ].join(' ')}
                  >
                    {bit}
                  </span>
                )
              })}
              {oi < 3 && (
                <span className="mx-0.5 select-none text-fore-3">.</span>
              )}
            </span>
          ))}
        </div>
      </td>
    </tr>
  )
}

export default function BinaryView({ result }: Props) {
  return (
    <div className="overflow-hidden rounded border border-edge bg-panel">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 bg-signal px-4 py-2.5">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-canvas">
          Binary Breakdown
        </span>
        <div className="flex items-center gap-5 text-[10px] text-canvas/70">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-[2px] border border-black/20 bg-black/15" />
            Network bits ({result.cidr})
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-[2px] border border-black/20 bg-black/25" />
            Host bits ({32 - result.cidr})
          </span>
        </div>
      </div>
      <div className="overflow-x-auto px-4 py-3">
        <table className="w-full min-w-[600px]">
          <tbody>
            <BinaryRow label="IP Address" value={result.ipBinary}        cidr={result.cidr} />
            <BinaryRow label="Subnet Mask" value={result.maskBinary} />
            <BinaryRow label="Network"    value={result.networkBinary}   cidr={result.cidr} />
            <BinaryRow label="Broadcast"  value={result.broadcastBinary} cidr={result.cidr} />
          </tbody>
        </table>
      </div>
    </div>
  )
}
