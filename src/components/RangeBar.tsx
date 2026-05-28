import type { SubnetResult } from '../lib/subnet'
import { octetsToInt, parseIP } from '../lib/subnet'

interface Props {
  result: SubnetResult
}

export default function RangeBar({ result }: Props) {
  const netInt  = octetsToInt(parseIP(result.networkAddress))
  const bcast   = octetsToInt(parseIP(result.broadcastAddress))
  const ipInt   = octetsToInt(parseIP(result.ip))

  const totalSpace = 0xffffffff
  const startPct = (netInt  / totalSpace) * 100
  const widthPct = Math.max(((bcast - netInt + 1) / (totalSpace + 1)) * 100, 0.15)
  const ipOffsetPct = widthPct === 0 ? 0 : ((ipInt - netInt) / (bcast - netInt || 1)) * widthPct

  return (
    <div className="overflow-hidden rounded border border-edge bg-panel">
      <div className="flex items-center justify-between border-b border-black/10 bg-signal px-4 py-2.5">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-canvas">
          Address Space
        </span>
        <span className="font-mono text-[10px] text-canvas/70">
          {result.networkAddress} — {result.broadcastAddress}
        </span>
      </div>
      <div className="px-4 py-3">
        {/* IPv4 space bar */}
        <div className="relative h-5 w-full overflow-hidden rounded bg-raised">
          {/* subnet block */}
          <div
            className="absolute inset-y-0 rounded bg-signal/25 transition-all"
            style={{ left: `${startPct}%`, width: `${widthPct}%` }}
          />
          {/* IP marker */}
          <div
            className="absolute inset-y-0 w-[2px] bg-signal"
            style={{ left: `calc(${startPct}% + ${ipOffsetPct}%)` }}
          />
        </div>

        {/* labels */}
        <div className="mt-2 flex justify-between font-mono text-[9px] text-fore-3 select-none">
          <span>0.0.0.0</span>
          <span className="text-signal">{result.ip}</span>
          <span>255.255.255.255</span>
        </div>

        {/* size legend */}
        <div className="mt-2.5 flex flex-wrap gap-x-5 gap-y-1 text-[10px] text-fore-3">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-4 rounded-[2px] bg-signal/30 border border-signal/25" />
            Subnet ({result.totalAddresses.toLocaleString()} addresses)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-0.5 bg-signal" />
            Your IP ({result.ip})
          </span>
        </div>
      </div>
    </div>
  )
}
