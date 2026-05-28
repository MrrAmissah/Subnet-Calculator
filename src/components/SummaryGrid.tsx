import { useState } from 'react'
import type { SubnetResult } from '../lib/subnet'
import { getAdjacentCIDRs, isIPInSubnet, formatReport, validateIP } from '../lib/subnet'
import CopyButton from './CopyButton'

interface Props {
  result: SubnetResult | null
  onNavigate?: (cidrNotation: string) => void
}

function MetricCell({
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
    <div className="group flex flex-col gap-1.5 bg-panel px-4 py-3 transition-colors hover:bg-raised">
      <span className="text-[9px] font-semibold uppercase tracking-widest text-fore-3">
        {label}
      </span>
      <div className="flex min-w-0 items-center gap-1.5">
        <span
          className={`min-w-0 truncate text-[13px] font-medium leading-tight text-fore ${mono ? 'font-mono' : ''}`}
          title={value}
        >
          {value}
        </span>
        {copyable && (
          <span className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100">
            <CopyButton value={value} />
          </span>
        )}
      </div>
    </div>
  )
}

function InfoIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" className="shrink-0">
      <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2" />
      <line x1="6" y1="5.2" x2="6" y2="8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="6" cy="3.5" r="0.65" fill="currentColor" />
    </svg>
  )
}

function LinkIcon({ active }: { active?: boolean }) {
  return active ? (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
      <path d="M1.5 6.5L4.5 9.5L10.5 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
      <path d="M5 3H3a2 2 0 000 4h1m3 2h2a2 2 0 000-4H8M4 6h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

function ReportIcon({ active }: { active?: boolean }) {
  return active ? (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
      <path d="M1.5 6.5L4.5 9.5L10.5 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
      <rect x="1.5" y="0.75" width="9" height="10.5" rx="1.25" stroke="currentColor" strokeWidth="1.2" />
      <line x1="3.5" y1="3.5" x2="8.5" y2="3.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      <line x1="3.5" y1="5.5" x2="8.5" y2="5.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      <line x1="3.5" y1="7.5" x2="6.5" y2="7.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
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

const iconBtnClass =
  'flex h-5 w-5 items-center justify-center rounded text-canvas/70 transition-colors hover:bg-black/15 hover:text-canvas focus:outline-none focus-visible:ring-1 focus-visible:ring-black/30'

export default function SummaryGrid({ result, onNavigate }: Props) {
  const [checkIP, setCheckIP] = useState('')
  const [shareCopied, setShareCopied] = useState(false)
  const [reportCopied, setReportCopied] = useState(false)

  const adjacent = result ? getAdjacentCIDRs(result.networkAddress, result.cidr) : null

  const ipCheckResult =
    result && checkIP && validateIP(checkIP)
      ? isIPInSubnet(checkIP, result.networkAddress, result.broadcastAddress)
      : null

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).catch(() => {})
    setShareCopied(true)
    setTimeout(() => setShareCopied(false), 1200)
  }

  const handleCopyReport = () => {
    if (!result) return
    navigator.clipboard.writeText(formatReport(result)).catch(() => {})
    setReportCopied(true)
    setTimeout(() => setReportCopied(false), 1200)
  }

  return (
    <div className="flex flex-col overflow-hidden rounded border border-edge bg-panel">
      <div className="flex items-center justify-between border-b border-black/10 bg-signal px-4 py-2.5">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-canvas">
          Network Summary
        </span>
        {result && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              title={shareCopied ? 'Copied!' : 'Copy link'}
              className={`${iconBtnClass} ${shareCopied ? 'text-signal' : ''}`}
            >
              <LinkIcon active={shareCopied} />
            </button>
            <button
              onClick={handleCopyReport}
              title={reportCopied ? 'Copied!' : 'Copy full report'}
              className={`${iconBtnClass} ${reportCopied ? 'text-signal' : ''}`}
            >
              <ReportIcon active={reportCopied} />
            </button>
            <span className="rounded border border-black/15 bg-black/15 px-2 py-0.5 font-mono text-xs font-medium text-canvas">
              {result.ip}/{result.cidr}
            </span>
          </div>
        )}
      </div>

      {!result ? (
        <EmptyState />
      ) : (
        <>
          {/* 2×2 primary metrics */}
          <div className="grid grid-cols-2 gap-px bg-edge">
            <MetricCell label="Network Address"   value={result.networkAddress}   copyable />
            <MetricCell label="Broadcast Address" value={result.broadcastAddress} copyable />
            <MetricCell label="Subnet Mask"       value={result.subnetMask}       copyable />
            <MetricCell label="Usable Hosts"      value={result.usableHosts.toLocaleString()} mono={false} />
          </div>

          {/* Scope row */}
          <div className="border-t border-edge/60">
            <div className="group flex items-center justify-between gap-4 px-4 py-2.5 transition-colors hover:bg-raised">
              <span className="shrink-0 text-[10px] font-medium uppercase tracking-widest text-fore-3">
                Scope
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-fore">
                  {result.ipClass}
                  {!result.ipClass.includes('(') && (
                    <span className="ml-1.5 text-[9px] font-normal text-fore-3">classful</span>
                  )}
                </span>
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

          {/* Adjacent subnet navigation */}
          {(adjacent?.prev || adjacent?.next) && (
            <div className="flex items-center justify-between gap-3 border-t border-edge/60 px-4 py-2">
              <span className="shrink-0 text-[10px] font-medium uppercase tracking-widest text-fore-3">
                Adjacent /{result.cidr}
              </span>
              <div className="flex items-center gap-1.5">
                {adjacent?.prev && (
                  <button
                    onClick={() => onNavigate?.(adjacent.prev!)}
                    className="flex items-center gap-1 rounded border border-edge-hi bg-raised px-2 py-0.5 font-mono text-[10px] text-fore-2 transition-colors hover:border-signal/40 hover:bg-signal/8 hover:text-signal focus:outline-none"
                    title={`Navigate to ${adjacent.prev}`}
                  >
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className="shrink-0">
                      <path d="M5 1.5L2.5 4L5 6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {adjacent.prev}
                  </button>
                )}
                {adjacent?.next && (
                  <button
                    onClick={() => onNavigate?.(adjacent.next!)}
                    className="flex items-center gap-1 rounded border border-edge-hi bg-raised px-2 py-0.5 font-mono text-[10px] text-fore-2 transition-colors hover:border-signal/40 hover:bg-signal/8 hover:text-signal focus:outline-none"
                    title={`Navigate to ${adjacent.next}`}
                  >
                    {adjacent.next}
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className="shrink-0">
                      <path d="M3 1.5L5.5 4L3 6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* IP-in-subnet checker */}
          <div className="border-t border-edge/60 px-4 py-2.5">
            <p className="mb-1.5 text-[10px] font-medium uppercase tracking-widest text-fore-3">
              IP in subnet?
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={checkIP}
                onChange={e => setCheckIP(e.target.value)}
                placeholder="e.g. 192.168.1.50"
                spellCheck={false}
                autoComplete="off"
                className="min-w-0 flex-1 rounded border border-edge-hi bg-raised px-2.5 py-1.5 font-mono text-xs text-fore placeholder-fore-3 outline-none transition-colors focus:border-signal/50 focus:ring-1 focus:ring-signal/20"
              />
              {ipCheckResult !== null && (
                <span
                  className={[
                    'shrink-0 rounded px-2 py-1 text-[10px] font-semibold',
                    ipCheckResult
                      ? 'bg-ok/10 text-ok'
                      : 'bg-fail/10 text-fail',
                  ].join(' ')}
                >
                  {ipCheckResult ? '✓ In subnet' : '✗ Outside'}
                </span>
              )}
            </div>
          </div>

          {(result.cidr === 31 || result.cidr === 32) && (
            <div className="border-t border-edge bg-signal/8 px-4 py-2.5">
              <p className="flex items-center gap-1.5 text-[11px] text-signal">
                <InfoIcon />
                {result.cidr === 31
                  ? '/31 — RFC 3021 point-to-point: both addresses are usable hosts'
                  : '/32 — Single host route'}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
