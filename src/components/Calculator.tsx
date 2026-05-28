import { useState, useEffect, useCallback } from 'react'
import { calculate, parseCIDRNotation, validateIP, validateCIDR, type SubnetResult } from '../lib/subnet'
import InputPanel from './InputPanel'
import SummaryGrid from './SummaryGrid'
import DetailSection from './DetailSection'
import BinaryView from './BinaryView'
import RangeBar from './RangeBar'
import SplitPreview from './SplitPreview'

const HISTORY_KEY = 'subnet-history'
const HISTORY_MAX = 8

function loadHistory(): string[] {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) ?? '[]')
  } catch {
    return []
  }
}

function saveHistory(entries: string[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(entries))
}

function readFromURL(): { ip: string; cidr: number } | null {
  const params = new URLSearchParams(window.location.search)
  const q = params.get('q')
  if (!q) return null
  return parseCIDRNotation(q)
}

function writeToURL(ip: string, cidr: number) {
  const params = new URLSearchParams()
  params.set('q', `${ip}/${cidr}`)
  window.history.replaceState(null, '', `${window.location.pathname}?${params}`)
}

function buildDetails(result: SubnetResult) {
  return {
    addressRange: [
      { label: 'First Usable Host', value: result.firstHost, mono: true, copyable: true },
      { label: 'Last Usable Host', value: result.lastHost, mono: true, copyable: true },
      { label: 'Total Addresses', value: result.totalAddresses.toLocaleString(), mono: false },
      { label: 'Usable Hosts', value: result.usableHosts.toLocaleString(), mono: false },
    ],
    masks: [
      { label: 'Subnet Mask', value: result.subnetMask, mono: true, copyable: true },
      { label: 'Wildcard Mask', value: result.wildcardMask, mono: true, copyable: true },
      { label: 'CIDR Notation', value: `/${result.cidr}`, mono: true },
    ],
    classification: [
      {
        label: 'IP Class',
        value: result.ipClass + (!result.ipClass.includes('(') ? ' · classful (legacy)' : ''),
      },
      { label: 'Scope', value: result.isPrivate ? 'Private' : 'Public' },
      { label: 'RFC 1918', value: result.isPrivate ? 'Yes' : 'No' },
    ],
    technical: [
      { label: 'IP Hex', value: result.ipHex, mono: true, copyable: true },
      { label: 'Network Hex', value: result.networkHex, mono: true, copyable: true },
      { label: 'Mask Hex', value: result.maskHex, mono: true, copyable: true },
    ],
  }
}

export default function Calculator() {
  const [input, setInput] = useState('192.168.1.10/24')
  const [cidr, setCidr] = useState(24)
  const [result, setResult] = useState<SubnetResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [history, setHistory] = useState<string[]>(loadHistory)

  const pushHistory = useCallback((entry: string) => {
    setHistory(prev => {
      const filtered = prev.filter(e => e !== entry)
      const next = [entry, ...filtered].slice(0, HISTORY_MAX)
      saveHistory(next)
      return next
    })
  }, [])

  const compute = useCallback((rawInput: string, rawCidr: number) => {
    const str = rawInput.includes('/') ? rawInput : `${rawInput}/${rawCidr}`
    const parsed = parseCIDRNotation(str)

    if (!parsed) {
      const ip = rawInput.split('/')[0].trim()
      if (!validateIP(ip)) {
        setError('Invalid IP — each octet must be 0–255')
      } else if (!validateCIDR(rawCidr)) {
        setError('Prefix must be 0–32')
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
      pushHistory(`${r.networkAddress}/${r.cidr}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Calculation error')
      setResult(null)
    }
  }, [pushHistory])

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

  // Keyboard shortcut: "/" focuses the CIDR input
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key !== '/') return
      const target = e.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT'
      ) return
      e.preventDefault()
      const el = document.getElementById('cidr-input') as HTMLInputElement | null
      if (el) { el.focus(); el.select() }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  const handleInputChange = (value: string) => {
    setInput(value)
    const slashMatch = value.match(/\/(\d+)$/)
    if (slashMatch) {
      const n = parseInt(slashMatch[1], 10)
      if (validateCIDR(n)) setCidr(n)
    }
    compute(value, cidr)
  }

  const handleCidrChange = (value: number) => {
    setCidr(value)
    const ip = input.split('/')[0].trim()
    const next = `${ip}/${value}`
    setInput(next)
    compute(next, value)
  }

  const details = result ? buildDetails(result) : null

  return (
    <div className="space-y-4">
      {/* Two-column: input (left) + summary (right) */}
      <div className="grid gap-4 lg:grid-cols-[380px_1fr] lg:items-stretch">
        <InputPanel
          input={input}
          cidr={cidr}
          error={error}
          history={history}
          onInputChange={handleInputChange}
          onCidrChange={handleCidrChange}
        />
        <SummaryGrid result={result} onNavigate={handleInputChange} />
      </div>

      {/* Detail panels — 4-up on wide screens */}
      {details && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <DetailSection title="Address Range"  items={details.addressRange}    color="signal" />
          <DetailSection title="Masks"          items={details.masks}           color="ok" />
          <DetailSection title="Classification" items={details.classification}  color="warn" />
          <DetailSection title="Technical"      items={details.technical}       color="info" />
        </div>
      )}

      {/* Subnet split preview */}
      {result && <SplitPreview result={result} />}

      {/* Address space range bar */}
      {result && <RangeBar result={result} />}

      {/* Binary breakdown */}
      {result && <BinaryView result={result} />}
    </div>
  )
}
