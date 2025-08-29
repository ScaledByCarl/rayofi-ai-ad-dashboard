import { supabaseAdmin } from '@/lib/supabaseAdmin'
import Filters from '@/components/Filters'
import Summary from '@/components/Summary'
import TableView from '@/components/TableView'
import Charts from '@/components/Charts'

export const dynamic = 'force-dynamic'

function parseDate(d: string | null, fallbackDays: number) {
  if (d) return d
  const since = new Date(Date.now() - 1000*60*60*24*fallbackDays).toISOString().slice(0,10)
  return since
}

export default async function Page({ searchParams }: { searchParams: Record<string,string|undefined>}) {
  const since = parseDate(searchParams.since ?? null, 30)
  const until = (searchParams.until ?? new Date().toISOString().slice(0,10)) as string
  const product = (searchParams.product ?? 'All') as string

  let query = supabaseAdmin.from('ad_insights').select('*').gte('date', since).lte('date', until).order('date', { ascending: false }).limit(2000)
  if (product !== 'All') query = query.eq('product', product)

  const { data, error } = await query
  if (error) throw error

  return (
    <div className="space-y-6">
      <Filters since={since} until={until} product={product} />
      <Summary rows={data ?? []} />
      <Charts rows={data ?? []} />
      <TableView rows={data ?? []} />
    </div>
  )
}
