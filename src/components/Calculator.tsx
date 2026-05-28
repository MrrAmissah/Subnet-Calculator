import { useState, useEffect, useCallback } from 'react'
import { calculate, parseCIDRNotation, validateIP, validateCIDR, type SubnetResult } from '../lib/subnet'
import ResultCard from './ResultCard'
import BinaryView from './BinaryView'

function readFromURL(): { ip: string; cidr: number } | null {
  const params = new URLSearchParams(window.location.search)
  const q = params.get('q')
  if (!q) return null
  return parseCIDRNotation(q)
}

function writeToURL(ip: string, cidr: number) {
  const params = new URLSearchParams()
  params.set('q', `${ip}/${cidr}`)
  const newURL = `${window.location.pathname}?${params.toString()}`
  window.history.replaceState(null, '', newURL)
}

export default function Calculator() {
  const [input, setInput] = useState('192.168.1.10/24')
  const [cidr, setCidr] = useState(24)
  const [result, setResult] = useState<SubnetResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const compute = useCallback((rawInput: string, rawCidr: number) => {
    const parsed = parseCIDRNotation(`${rawInput.includes('/') ? rawInput : rawInput + '/' + rawCidr}`)
    if (!parsed) {
      // Try validating parts individually for a better error message
      const ip = rawInput.split('/')[0].trim()
      if (!validateIP(ip)) {
        setError('Invalid IP address. Each octet must be 0–255.')
      } else if (!validateCIDR(rawCidr)) {
        setError('Prefix must be between 0 and 32.')
      } else {
        setError('Enter a valid address like 192.168.1.10/24')
      }
      setResult(null)
      return
    }
    try {
      const r = calculate(parsed.ip, parsed.cidr)
      setResult(r)
      setError(null)
      writeToURL(parsed.ip, parsed.cidr)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Calculation error')
      setResult(null)
    }
  }, [])

  // Initialise from URL on mount
  useEffect(() => {
    const fromURL = readFromURL()
    if (fromURL) {
      const str = `${fromURL.ip}/${fromURL.cidr}`
      setInput(str)
      setCidr(fromURL.cidr)
      compute(str, fromURL.cidr)
    } else {
      compute('192.168.1.10/24', 24)
    }
  }, [compute])

  const handleInputChange = (value: string) => {
    setInput(value)
    // Sync the CIDR slider if the slash notation is valid
    const slashMatch = value.match(/\/(\d+)$/)
    if (slashMatch) {
      const n = parseInt(slashMatch[1], 10)
      if (validateCIDR(n)) setCidr(n)
    }
    compute(value, cidr)
  }

  const handleCidrChange = (value: number) => {
    setCidr(value)
    // Rewrite the slider portion of the input field
    const ip = input.split('/')[0].trim()
    const newInput = `${ip}/${value}`
    setInput(newInput)
    compute(newInput, value)
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      {/* Header */}
      <div className="mb-10 text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-300">
          IPv4 · CIDR
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-100 sm:text-4xl">
          Subnet Calculator
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Enter an IP address with prefix — results update instantly
        </p>
      </div>

      {/* Input area */}
      <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="flex-1">
            <label htmlFor="cidr-input" className="mb-1.5 block text-xs font-medium text-slate-400">
              IP / Prefix
            </label>
            <input
              id="cidr-input"
              type="text"
              value={input}
              onChange={e => handleInputChange(e.target.value)}
              placeholder="192.168.1.10/24"
              className={[
                'w-full rounded-lg border bg-white/5 px-3.5 py-2.5 font-mono text-sm text-slate-100',
                'placeholder-slate-600 outline-none transition',
                'focus:ring-2',
                error
                  ? 'border-red-500/50 focus:border-red-500/80 focus:ring-red-500/20'
                  : 'border-white/10 focus:border-violet-500/60 focus:ring-violet-500/20',
              ].join(' ')}
              spellCheck={false}
              autoComplete="off"
            />
            {error && (
              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-400">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm-.75 3.75a.75.75 0 011.5 0v3.5a.75.75 0 01-1.5 0v-3.5zm.75 7a.875.875 0 110-1.75.875.875 0 010 1.75z" />
                </svg>
                {error}
              </p>
            )}
          </div>

          <div className="sm:w-40">
            <label htmlFor="cidr-slider" className="mb-1.5 block text-xs font-medium text-slate-400">
              Prefix length
            </label>
            <div className="flex items-center gap-2">
              <input
                id="cidr-slider"
                type="range"
                min={0}
                max={32}
                value={cidr}
                onChange={e => handleCidrChange(Number(e.target.value))}
                className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-white/10 accent-violet-500"
              />
              <span className="w-8 text-right font-mono text-sm font-semibold text-slate-200">
                /{cidr}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Addresses grid */}
          <section>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Addresses
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <ResultCard label="Network Address" value={result.networkAddress} mono />
              <ResultCard label="Broadcast Address" value={result.broadcastAddress} mono />
              <ResultCard label="First Usable Host" value={result.firstHost} mono />
              <ResultCard label="Last Usable Host" value={result.lastHost} mono />
            </div>
          </section>

          {/* Masks grid */}
          <section>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Masks
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <ResultCard label="Subnet Mask" value={result.subnetMask} mono />
              <ResultCard label="Wildcard Mask" value={result.wildcardMask} mono />
            </div>
          </section>

          {/* Info grid */}
          <section>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Info
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <ResultCard
                label="Total Addresses"
                value={result.totalAddresses.toLocaleString()}
              />
              <ResultCard
                label="Usable Hosts"
                value={result.usableHosts.toLocaleString()}
              />
              <ResultCard
                label="IP Class"
                value={result.ipClass}
                badge={result.isPrivate ? 'Private (RFC 1918)' : 'Public'}
                badgeVariant={result.isPrivate ? 'green' : 'blue'}
              />
              <ResultCard
                label="CIDR Notation"
                value={`${result.ip}/${result.cidr}`}
                mono
              />
            </div>
          </section>

          {/* RFC edge case notes */}
          {(result.cidr === 31 || result.cidr === 32) && (
            <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-xs text-amber-300">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" className="mt-0.5 shrink-0">
                <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm-.75 3.75a.75.75 0 011.5 0v3.5a.75.75 0 01-1.5 0v-3.5zm.75 7a.875.875 0 110-1.75.875.875 0 010 1.75z" />
              </svg>
              {result.cidr === 31
                ? '/31 — RFC 3021 point-to-point link. Both addresses are usable hosts; there is no separate network/broadcast address.'
                : '/32 — Single host route. The address represents exactly one host.'}
            </div>
          )}

          {/* Binary breakdown */}
          <section>
            <BinaryView result={result} />
          </section>
        </div>
      )}
    </div>
  )
}
