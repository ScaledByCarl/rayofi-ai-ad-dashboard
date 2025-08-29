'use client'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid, Legend } from 'recharts'

export default function Charts({ rows }: { rows: any[]}) {
  const byDate: Record<string, any> = {}
  rows.forEach(r => {
    byDate[r.date] = byDate[r.date] || { date: r.date, spend: 0, purchases: 0, ctr: 0, imps: 0, clicks: 0, cpa: 0 }
    byDate[r.date].spend += r.spend_eur || 0
    byDate[r.date].purchases += r.purchases || 0
    byDate[r.date].imps += r.impressions || 0
    byDate[r.date].clicks += r.clicks || 0
  })
  const data = Object.values(byDate).sort((a:any,b:any)=>a.date.localeCompare(b.date)).map((d:any)=>{
    const ctr = d.imps>0 ? (d.clicks/d.imps)*100 : 0
    const cpa = d.purchases>0 ? (d.spend/d.purchases) : 0
    return { ...d, ctr, cpa }
  })

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="bg-white/5 rounded-xl p-4">
        <div className="text-sm opacity-70 mb-2">Spend vs Purchases</div>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Bar dataKey="spend" yAxisId="left" name="Spend" />
            <Bar dataKey="purchases" yAxisId="right" name="Purchases" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white/5 rounded-xl p-4">
        <div className="text-sm opacity-70 mb-2">CTR % and CPA</div>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="ctr" name="CTR %" />
            <Line type="monotone" dataKey="cpa" name="CPA" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
