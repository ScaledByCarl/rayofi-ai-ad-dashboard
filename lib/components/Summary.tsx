type Row = {
  date: string
  spend_eur: number
  impressions: number
  clicks: number
  purchases: number
  purchase_value: number
  roas: number
  cpa_eur: number
}

function sum<T>(rows: T[], f: (r: any) => number) { return rows.reduce((a, r) => a + (f(r) || 0), 0) }

export default function Summary({ rows }: { rows: Row[] }) {
  const spend = sum(rows, r => r.spend_eur)
  const imps = sum(rows, r => r.impressions)
  const clicks = sum(rows, r => r.clicks)
  const purchases = sum(rows, r => r.purchases)
  const value = sum(rows, r => r.purchase_value)
  const ctr = imps > 0 ? (clicks / imps) * 100 : 0
  const cpc = clicks > 0 ? (spend / clicks) : 0
  const cpa = purchases > 0 ? (spend / purchases) : 0
  const roas = spend > 0 ? (value / spend) : 0

  return (
    <div className="grid md:grid-cols-5 gap-3">
      {[
        ['Spend', `€${spend.toFixed(2)}`],
        ['Impressions', imps.toLocaleString()],
        ['CTR', `${ctr.toFixed(2)}%`],
        ['CPA', `€${cpa.toFixed(2)}`],
        ['ROAS', roas.toFixed(2)],
      ].map(([k,v]) => (
        <div key={k} className="bg-white/5 rounded-xl p-4">
          <div className="text-xs opacity-60">{k}</div>
          <div className="text-xl font-semibold">{v}</div>
        </div>
      ))}
    </div>
  )
}
