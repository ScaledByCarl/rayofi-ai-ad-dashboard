'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Filters({ since, until, product }: { since: string, until: string, product: string }) {
  const r = useRouter()
  const [s, setS] = useState(since)
  const [u, setU] = useState(until)
  const [p, setP] = useState(product)

  function apply() {
    const params = new URLSearchParams()
    params.set('since', s)
    params.set('until', u)
    params.set('product', p)
    r.push('/?' + params.toString())
  }

  return (
    <div className="grid md:grid-cols-5 gap-3 bg-white/5 p-3 rounded-xl">
      <div className="col-span-1">
        <label className="block text-xs opacity-70">Since</label>
        <input type="date" value={s} onChange={e => setS(e.target.value)} className="w-full bg-white/10 rounded px-2 py-1"/>
      </div>
      <div className="col-span-1">
        <label className="block text-xs opacity-70">Until</label>
        <input type="date" value={u} onChange={e => setU(e.target.value)} className="w-full bg-white/10 rounded px-2 py-1"/>
      </div>
      <div className="col-span-1">
        <label className="block text-xs opacity-70">Product</label>
        <select value={p} onChange={e => setP(e.target.value)} className="w-full bg-white/10 rounded px-2 py-1">
          <option>All</option>
          <option>Go-Tone</option>
          <option>SwimComm</option>
          <option>FreeSwim</option>
          <option>Unknown</option>
        </select>
      </div>
      <div className="col-span-2 flex items-end justify-end">
        <button onClick={apply} className="px-4 py-2 rounded-xl bg-[var(--accent)] text-black font-semibold">Apply</button>
      </div>
    </div>
  )
}
