import type { SubnetResult } from '../lib/subnet'

interface Props {
  result: SubnetResult
}

function BinaryRow({ label, value, cidr }: { label: string; value: string; cidr?: number }) {
  const parts = value.split('.')
  let bitIndex = 0

  return (
    <tr className="border-t border-white/6">
      <td className="py-2 pr-4 text-xs font-medium text-slate-400 whitespace-nowrap align-middle w-28">
        {label}
      </td>
      <td className="py-2 align-middle">
        <div className="flex flex-wrap gap-y-1 font-mono text-xs leading-none">
          {parts.map((octet, oi) => (
            <span key={oi} className="inline-flex items-center">
              {octet.split('').map((bit) => {
                const idx = bitIndex++
                const isNet = cidr !== undefined && idx < cidr
                return (
                  <span
                    key={idx}
                    className={[
                      'inline-flex items-center justify-center w-[14px] h-5 rounded-[2px] font-bold transition-colors',
                      bit === '1' ? 'text-slate-100' : 'text-slate-500',
                      cidr !== undefined
                        ? isNet
                          ? 'bg-violet-500/25 text-violet-300'
                          : 'bg-sky-500/20 text-sky-300'
                        : 'bg-white/5',
                    ].join(' ')}
                  >
                    {bit}
                  </span>
                )
              })}
              {oi < 3 && (
                <span className="mx-0.5 text-slate-600 select-none">.</span>
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
    <div className="rounded-xl border border-white/8 bg-white/4 p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-slate-200">Binary Breakdown</h3>
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-[2px] bg-violet-500/40" />
            Network bits (/{result.cidr})
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-[2px] bg-sky-500/30" />
            Host bits
          </span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
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
