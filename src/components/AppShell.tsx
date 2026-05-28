import type { ReactNode } from 'react'
import Header from './Header'

interface Props {
  children: ReactNode
}

export default function AppShell({ children }: Props) {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-[1200px] px-4 py-5 sm:px-6">
        {children}
      </main>
      <footer className="pb-6 text-center text-[11px] text-gray-700">
        IPv4 Subnet Calculator · All calculations performed client-side
      </footer>
    </div>
  )
}
