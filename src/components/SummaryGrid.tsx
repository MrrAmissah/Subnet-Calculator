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
    <div className="group flex items-center justify-between gap-4 px-4 py-2.5 transition-colors hover:bg-raised">
      <span className="w-36 shrink-0 text-[10px] font-medium uppercase tracking-widest text-fore-3">
        {label}
      </span>
      <div className="flex flex-1 items-center justify-end gap-1.5 min-w-0">
        <span
          className={`truncate text-sm text-fore ${mono ? 'font-mono' : ''}`}
          title={value}
        >
          {value}
        </span>
        {copyable && (
          <span className="opacity-0 transition-opacity group-hover:opacity-100">
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
      <div className="flex h-10 w-10 items-center justify-center rounded border border-edge bg-raised">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-fore-3">
          <rect x="2" y="5" width="14" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
          <line x1="5" y1="9" x2="7" y2="9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="9" y1="9" x2="13" y2="9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </div>
      <div>
        <p className="text-sm font-medium text-fore-2">No results yet</p>
        <p className="mt-0.5 text-xs text-fore-3">Enter a valid CIDR address to calculate</p>
      </div>
    </div>
  )
}

export default function SummaryGrid({ result }: Props) {
  return (
    <div className="flex flex-col overflow-hidden rounded border border-edge bg-panel">
      <div className="flex items-center justify-between border-b border-edge px-4 py-2.5">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-fore-3">
          Network Summary
        </span>
        {result && (
          <span className="font-mono text-xs text-signal">
            {result.ip}/{result.cidr}
          </span>
        )}
      </div>

      {!result ? (
        <EmptyState />
      ) : (
        <>
          <div className="divide-y divide-edge/60">
            <SummaryRow label="Network Address"   value={result.networkAddress}   copyable />
            <SummaryRow label="Broadcast Address" value={result.broadcastAddress} copyable />
            <SummaryRow label="Subnet Mask"       value={result.subnetMask}       copyable />
            <SummaryRow
              label="Usable Hosts"
              value={result.usableHosts.toLocaleString()}
              mono={false}
            />
          </div>

          <div className="border-t border-edge divide-y divide-edge/60">
            <div className="group flex items-center justify-between gap-4 px-4 py-2.5">
              <span className="w-36 shrink-0 text-[10px] font-medium uppercase tracking-widest text-fore-3">
                Scope
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-fore">{result.ipClass}</span>
                <span
                  className={[
                    'rounded border px-1.5 py-0.5 text-[10px] font-medium',
                    result.isPrivate
                      ? 'border-ok/25 bg-ok/10 text-ok'
                      : 'border-signal/25 bg-signal/8 text-signal',
                  ].join(' ')}
                >
                  {result.isPrivate ? 'Private' : 'Public'}
                </span>
              </div>
            </div>
          </div>

          {(result.cidr === 31 || result.cidr === 32) && (
            <div className="border-t border-edge bg-warn/5 px-4 py-2.5">
              <p className="text-[11px] text-warn">
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
