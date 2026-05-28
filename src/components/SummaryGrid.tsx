import type { SubnetResult } from '../lib/subnet'
import CopyButton from './CopyButton'

interface Props {
  result: SubnetResult | null
}

function SummaryRow({
  label,
  value,
  mono = true,
  copyable = false,
}: {
  label: string
  value: string
  mono?: boolean
  copyable?: boolean
}) {
  return (
    <div className="group flex items-center justify-between gap-4 px-4 py-2.5 hover:bg-gray-900/40 transition-colors">
      <span className="w-36 shrink-0 text-[10px] font-medium uppercase tracking-widest text-gray-500">
        {label}
      </span>
      <div className="flex flex-1 items-center justify-end gap-1.5 min-w-0">
        <span
          className={`truncate text-sm text-gray-200 ${mono ? 'font-mono' : ''}`}
          title={value}
        >
          {value}
        </span>
        {copyable && (
          <span className="opacity-0 group-hover:opacity-100 transition-opacity">
            <CopyButton value={value} />
          </span>
        )}
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded border border-gray-800 bg-gray-900">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-gray-600">
          <rect x="2" y="5" width="14" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
          <line x1="5" y1="9" x2="7" y2="9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="9" y1="9" x2="13" y2="9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">No results yet</p>
        <p className="mt-0.5 text-xs text-gray-600">Enter a valid CIDR address to calculate</p>
      </div>
    </div>
  )
}

export default function SummaryGrid({ result }: Props) {
  return (
    <div className="flex flex-col overflow-hidden rounded border border-gray-800 bg-panel">
      {/* Panel header */}
      <div className="flex items-center justify-between border-b border-gray-800 px-4 py-2.5">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-500">
          Network Summary
        </span>
        {result && (
          <span className="font-mono text-xs text-cyan-400">
            {result.ip}/{result.cidr}
          </span>
        )}
      </div>

      {!result ? (
        <EmptyState />
      ) : (
        <>
          {/* Core 4 summary values */}
          <div className="divide-y divide-gray-800/60">
            <SummaryRow label="Network Address" value={result.networkAddress} copyable />
            <SummaryRow label="Broadcast Address" value={result.broadcastAddress} copyable />
            <SummaryRow label="Subnet Mask" value={result.subnetMask} copyable />
            <SummaryRow
              label="Usable Hosts"
              value={result.usableHosts.toLocaleString()}
              mono={false}
            />
          </div>

          {/* Classification stripe */}
          <div className="border-t border-gray-800 divide-y divide-gray-800/60">
            <div className="group flex items-center justify-between gap-4 px-4 py-2.5">
              <span className="w-36 shrink-0 text-[10px] font-medium uppercase tracking-widest text-gray-500">
                Scope
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-200">{result.ipClass}</span>
                <span
                  className={[
                    'rounded border px-1.5 py-0.5 text-[10px] font-medium',
                    result.isPrivate
                      ? 'border-green-500/25 bg-green-500/10 text-green-400'
                      : 'border-cyan-400/25 bg-cyan-400/8 text-cyan-400',
                  ].join(' ')}
                >
                  {result.isPrivate ? 'Private' : 'Public'}
                </span>
              </div>
            </div>
          </div>

          {/* RFC edge-case notice */}
          {(result.cidr === 31 || result.cidr === 32) && (
            <div className="border-t border-gray-800 bg-amber-500/5 px-4 py-2.5">
              <p className="text-[11px] text-amber-400">
                {result.cidr === 31
                  ? '⚠  /31 — RFC 3021 point-to-point: both addresses are usable hosts'
                  : '⚠  /32 — Single host route'}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
