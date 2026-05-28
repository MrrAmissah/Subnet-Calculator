import { useState, useMemo } from 'react'
import type { SubnetResult } from '../lib/subnet'
import { splitSubnet } from '../lib/subnet'

interface Props {
  result: SubnetResult
}

export default function SplitPreview({ result }: Props) {
  const [open, setOpen] = useState(false)
  const [targetCidr, setTargetCidr] = useState<number>(result.cidr + 1 <= 32 ? result.cidr + 1 : 32)

  const maxTarget = 32
  const minTarget = result.cidr + 1

  const canSplit = minTarget <= maxTarget

  const subnets = useMemo(() => {
    if (!open || !canSplit) return []
    return splitSubnet(result.networkAddress, result.cidr, targetCidr)
  }, [open, canSplit, result.networkAddress, result.cidr, targetCidr])

  const count = canSplit ? Math.pow(2, targetCidr - result.cidr) : 0
  const capped = count > 512

  if (!canSplit) return null

  return (
    <div className="overflow-hidden rounded border border-edge bg-panel">
      {/* header / toggle */}
      <button
        onClick={() => setOpen(o => !o)}
        className="flex w-full items-center justify-between border-b border-black/10 bg-warn px-4 py-2.5 transition-opacity hover:opacity-90 focus:outline-none"
      >
        <span className="text-[10px] font-semibold uppercase tracking-widest text-canvas">
          Subnet Split Preview
        </span>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] text-canvas/70">
            /{result.cidr} → /{targetCidr}
          </span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            className={`text-canvas/70 transition-transform ${open ? 'rotate-180' : ''}`}
          >
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </button>

      {open && (
        <div className="px-4 py-3">
          {/* target prefix selector */}
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <span className="text-[10px] font-medium uppercase tracking-widest text-fore-3">
              Split into
            </span>
            <div className="flex flex-wrap gap-1.5">
              {Array.from({ length: maxTarget - minTarget + 1 }, (_, i) => minTarget + i).map(p => (
                <button
                  key={p}
                  onClick={() => setTargetCidr(p)}
                  className={[
                    'rounded border px-2 py-0.5 font-mono text-xs transition-colors focus:outline-none',
                    targetCidr === p
                      ? 'border-warn/50 bg-warn/15 text-warn font-semibold'
                      : 'border-edge-hi bg-raised text-fore-2 hover:border-warn/40 hover:bg-warn/8 hover:text-warn',
                  ].join(' ')}
                >
                  /{p}
                </button>
              ))}
            </div>
            <span className="ml-auto font-mono text-[10px] text-fore-3">
              {capped ? '512+ (showing first 512)' : `${count} subnet${count !== 1 ? 's' : ''}`}
            </span>
          </div>

          {/* subnet grid */}
          <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {subnets.map((s, i) => (
              <div
                key={s}
                className="rounded border border-edge bg-raised px-2 py-1.5 font-mono text-[10px] text-fore-2"
                title={`Subnet ${i + 1} of ${Math.min(count, 512)}`}
              >
                {s}
              </div>
            ))}
          </div>

          {capped && (
            <p className="mt-2 text-[10px] text-fore-3">
              Showing first 512 of {count.toLocaleString()} subnets.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
