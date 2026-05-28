import Calculator from './components/Calculator'

export default function App() {
  return (
    <div className="min-h-screen bg-[#0d0f14] text-slate-100 selection:bg-violet-500/30">
      {/* Subtle grid background */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      {/* Radial glow */}
      <div className="pointer-events-none fixed inset-0 flex items-start justify-center">
        <div className="h-[500px] w-[800px] rounded-full bg-violet-600/10 blur-[120px]" />
      </div>

      <div className="relative z-10">
        <Calculator />
      </div>

      <footer className="relative z-10 pb-8 text-center text-xs text-slate-600">
        Built with React · Vite · TypeScript · Tailwind CSS
      </footer>
    </div>
  )
}
