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
    <tr className="group border-t border-gray-800/70 first:border-0">
      <td className="whitespace-nowrap py-2 pr-4 align-middle">
        <span className="text-[10px] font-medium uppercase tracking-widest text-gray-500">
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
                        ? 'bg-cyan-400/15 text-cyan-300'
                        : bit === '1'
                          ? 'bg-gray-800/60 text-gray-400'
                          : 'text-gray-700',
                    ].join(' ')}
                  >
                    {bit}
                  </span>
                )
              })}
              {oi < 3 && (
                <span className="mx-0.5 select-none text-gray-700">.</span>
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
    <div className="rounded border border-gray-800 bg-panel">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-800 px-4 py-2.5">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-500">
          Binary Breakdown
        </span>
        <div className="flex items-center gap-4 text-[10px] text-gray-500">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-[2px] bg-cyan-400/20 border border-cyan-400/30" />
            Network ({result.cidr} bits)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-[2px] bg-gray-800/80 border border-gray-700" />
            Host ({32 - result.cidr} bits)
          </span>
        </div>
      </div>
      <div className="overflow-x-auto px-4 py-3">
        <table className="w-full min-w-[480px]">
          <tbody>
            <BinaryRow label="IP Address" value={result.ipBinary} cidr={result.cidr} />
            <BinaryRow label="Subnet Mask" value={result.maskBinary} />
            <BinaryRow label="Network" value={result.networkBinary} cidr={result.cidr} />
            <BinaryRow label="Broadcast" value={result.broadcastBinary} cidr={result.cidr} />
          </tbody>
        </table>
      </div>
    </div>
  )
}
