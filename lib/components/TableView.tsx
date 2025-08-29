function fmt(n: number, currency=false) {
  if (currency) return `€${(n||0).toFixed(2)}`
  return (n||0).toFixed(2)
}

export default function TableView({ rows }: { rows: any[] }) {
  return (
    <div className="bg-white/5 rounded-xl overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-white/10">
          <tr>
            {['Date','Campaign','Ad Set','Ad Name','Product','Spend','Imps','Clicks','CTR%','CPC','Purch','CPA','ROAS','Hit'].map(h=> (
              <th key={h} className="px-3 py-2 text-left">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => {
            const badge = r.hit_type === 'Full Hit' ? 'bg-green-500' : r.hit_type === 'Soft Hit' ? 'bg-yellow-500' : 'bg-red-500'
            return (
              <tr key={i} className="border-b border-white/10">
                <td className="px-3 py-2">{r.date}</td>
                <td className="px-3 py-2">{r.campaign}</td>
                <td className="px-3 py-2">{r.ad_set}</td>
                <td className="px-3 py-2">{r.ad_name}</td>
                <td className="px-3 py-2">{r.product}</td>
                <td className="px-3 py-2">{fmt(r.spend_eur, true)}</td>
                <td className="px-3 py-2">{r.impressions?.toLocaleString()}</td>
                <td className="px-3 py-2">{r.clicks}</td>
                <td className="px-3 py-2">{fmt(r.ctr)}</td>
                <td className="px-3 py-2">{fmt(r.cpc_eur, true)}</td>
                <td className="px-3 py-2">{r.purchases}</td>
                <td className="px-3 py-2">{fmt(r.cpa_eur, true)}</td>
                <td className="px-3 py-2">{fmt(r.roas)}</td>
                <td className="px-3 py-2"><span className={`px-2 py-1 rounded text-black ${badge}`}>{r.hit_type}</span></td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
