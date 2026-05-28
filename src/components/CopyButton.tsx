import { useState } from 'react'

interface Props {
  value: string
  size?: 'sm' | 'md'
}

export default function CopyButton({ value, size = 'sm' }: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch {}
  }

  const dim = size === 'sm' ? 'h-5 w-5' : 'h-6 w-6'

  return (
    <button
      onClick={handleCopy}
      title={copied ? 'Copied!' : 'Copy'}
      aria-label="Copy to clipboard"
      className={`${dim} flex items-center justify-center rounded text-fore-3 transition-colors hover:bg-edge hover:text-fore-2 focus:outline-none focus-visible:ring-1 focus-visible:ring-signal/50`}
    >
      {copied ? (
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
          <path d="M1.5 6.5L4.5 9.5L10.5 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-signal" />
        </svg>
      ) : (
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
          <rect x="4.25" y="0.75" width="7" height="7" rx="1.25" stroke="currentColor" strokeWidth="1.2" />
          <path d="M0.75 3.75v7.5h7.5V9.25" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  )
}
