import React, { useState, useEffect } from 'react'

function usePersistentState(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key)
      return saved ? JSON.parse(saved) : initialValue
    } catch {
      return initialValue
    }
  })
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
  }, [key, value])
  return [value, setValue]
}

export default function App() {
  const [earnings, setEarnings] = usePersistentState('earnings', 0)
  const [activeAIs, setActiveAIs] = usePersistentState('activeAIs', 0)
  const [energy, setEnergy] = usePersistentState('energy', 10)
  const [progress, setProgress] = usePersistentState('progress', 0)
  const [autoMode, setAutoMode] = usePersistentState('autoMode', true)

  useEffect(() => {
    if (!autoMode) return
    const t = setInterval(() => {
      setEarnings(e => e + Math.floor(Math.random()*8))
      setActiveAIs(a => Math.min(999, a + (Math.random()>0.6?1:0)))
      setEnergy(e => Math.min(100, e + 1))
      setProgress(p => Math.min(100, p + 1))
    }, 800)
    return () => clearInterval(t)
  }, [autoMode])

  const adjust = (setter, delta, min=0, max=100000) => setter(v => Math.min(max, Math.max(min, v + delta)))

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-black text-gray-100 flex flex-col items-center justify-start p-8">
      <header className="w-full max-w-4xl">
        <h1 className="text-4xl font-bold text-emerald-400 mb-2">🌿 GodAI Genesis — Dashboard</h1>
        <p className="text-gray-400 mb-6">Auto/manual control • persistent state • lightweight UI</p>
      </header>

      <main className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-900 p-4 rounded-xl shadow">
          <h2 className="text-xl font-semibold text-emerald-300 mb-3">Stats</h2>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Earnings" value={`₹${earnings}`} />
            <Stat label="Active AIs" value={activeAIs} />
            <Stat label="Energy" value={`${energy}%`} />
            <Stat label="Progress" value={`${progress}%`} />
          </div>

          <div className="mt-4 flex gap-3 flex-wrap">
            <button onClick={() => setAutoMode(!autoMode)} className={`px-4 py-2 rounded-xl font-semibold ${autoMode ? 'bg-emerald-400 text-black' : 'bg-gray-800 text-emerald-300 border border-emerald-600'}`}>
              {autoMode ? '🟢 Auto Mode' : '⚪ Manual Mode'}
            </button>
            <button onClick={() => { setEarnings(0); setActiveAIs(0); setEnergy(10); setProgress(0) }} className="px-4 py-2 rounded-xl border border-red-600 text-red-400">
              Reset
            </button>
          </div>
        </div>

        <div className="bg-gray-900 p-4 rounded-xl shadow">
          <h2 className="text-xl font-semibold text-emerald-300 mb-3">Controls</h2>
          <div className="grid grid-cols-1 gap-3">
            <Control label="Earnings" onPlus={() => adjust(setEarnings, +10)} onMinus={() => adjust(setEarnings, -10)} />
            <Control label="Active AIs" onPlus={() => adjust(setActiveAIs, +1)} onMinus={() => adjust(setActiveAIs, -1)} />
            <Control label="Energy" onPlus={() => adjust(setEnergy, +5,0,100)} onMinus={() => adjust(setEnergy, -5,0,100)} />
            <Control label="Progress" onPlus={() => adjust(setProgress, +5,0,100)} onMinus={() => adjust(setProgress, -5,0,100)} />
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
              <div style={{ width: `${progress}%` }} className="h-full bg-emerald-400 transition-all"></div>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full max-w-4xl text-sm text-gray-500 mt-6">
        © GodAI — persistent values saved locally
      </footer>
    </div>
  )
}

function Stat({label, value}) {
  return (
    <div className="bg-gray-800 p-3 rounded-lg flex flex-col">
      <span className="text-sm text-gray-400">{label}</span>
      <span className="text-lg font-bold text-emerald-300">{value}</span>
    </div>
  )
}

function Control({label, onPlus, onMinus}) {
  return (
    <div className="bg-gray-800 p-3 rounded-lg flex items-center justify-between">
      <div>
        <div className="text-sm text-gray-300">{label}</div>
      </div>
      <div className="flex gap-2">
        <button onClick={onMinus} className="px-3 py-1 rounded bg-gray-700">−</button>
        <button onClick={onPlus} className="px-3 py-1 rounded bg-emerald-400 text-black">+</button>
      </div>
    </div>
  )
}
