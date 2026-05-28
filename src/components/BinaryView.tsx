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
      <td className="whitespace-nowrap py-2 pr-4 align-middle">
        <span className="text-[10px] font-medium uppercase tracking-widest text-fore-3">
          {label}
        </span>
      </td>
      <td className="py-2 align-middle">
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
    <div className="rounded border border-edge bg-panel">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-edge px-4 py-2.5">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-fore-3">
          Binary Breakdown
        </span>
        <div className="flex items-center gap-4 text-[10px] text-fore-3">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-[2px] border border-signal/30 bg-signal/20" />
            Network ({result.cidr} bits)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-[2px] border border-edge-hi bg-edge/60" />
            Host ({32 - result.cidr} bits)
          </span>
        </div>
      </div>
      <div className="overflow-x-auto px-4 py-3">
        <table className="w-full min-w-[480px]">
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
