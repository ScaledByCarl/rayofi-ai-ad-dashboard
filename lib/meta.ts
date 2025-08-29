import { z } from 'zod'
import { supabaseAdmin } from './supabaseAdmin'
import { inferProduct, classifyHit } from './hitRules'

const FB_ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN!
const FB_AD_ACCOUNT_ID = process.env.FB_AD_ACCOUNT_ID!

const actionSchema = z.object({
  action_type: z.string(),
  value: z.string().optional()
}).array().optional()

const insightSchema = z.object({
  date_start: z.string(),
  campaign_name: z.string(),
  adset_name: z.string(),
  ad_name: z.string(),
  spend: z.string().transform(s => parseFloat(s) || 0),
  impressions: z.string().transform(s => parseInt(s) || 0),
  clicks: z.string().optional(),
  actions: actionSchema,
  action_values: actionSchema
})

export type InsightRow = z.infer<typeof insightSchema>

function getPurchaseCount(actions?: { action_type: string, value?: string }[]) {
  if (!actions) return 0
  const a = actions.find(a => a.action_type === 'offsite_conversion.purchase' || a.action_type === 'purchase')
  return a ? Math.round(parseFloat(a.value || '0')) || 0 : 0
}

function getPurchaseValue(action_values?: { action_type: string, value?: string }[]) {
  if (!action_values) return 0
  const a = action_values.find(a => a.action_type === 'offsite_conversion.purchase' || a.action_type === 'purchase')
  return a ? (parseFloat(a.value || '0') || 0) : 0
}

export async function fetchMetaInsights(since: string, until: string) {
  if (!FB_ACCESS_TOKEN || !FB_AD_ACCOUNT_ID) {
    throw new Error('Missing FB_ACCESS_TOKEN or FB_AD_ACCOUNT_ID')
  }

  const fields = [
    'date_start',
    'campaign_name',
    'adset_name',
    'ad_name',
    'spend',
    'impressions',
    'clicks',
    'actions',
    'action_values'
  ].join(',')

  let url = `https://graph.facebook.com/v20.0/${FB_AD_ACCOUNT_ID}/insights?` +
            `level=ad&time_range[since]=${since}&time_range[until]=${until}&` +
            `time_increment=1&fields=${fields}&limit=500&access_token=${encodeURIComponent(FB_ACCESS_TOKEN)}`

  let rows: InsightRow[] = []

  while (url) {
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } })
    if (!res.ok) {
      const txt = await res.text()
      throw new Error(`Meta API error: ${res.status} ${txt}`)
    }
    const data = await res.json()
    const parsed = z.object({ data: insightSchema.array(), paging: z.any().optional() }).safeParse(data)
    if (!parsed.success) {
      throw new Error('Failed to parse insights: ' + JSON.stringify(parsed.error.issues, null, 2))
    }
    rows.push(...parsed.data.data)
    url = parsed.data.paging?.next || ''
  }

  // Transform and upsert
  const upserts = rows.map(r => {
    const clicks = parseInt(r.clicks || '0') || 0
    const impressions = r.impressions || 0
    const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0
    const cpc = clicks > 0 ? (r.spend / clicks) : 0
    const purchases = getPurchaseCount(r.actions)
    const value = getPurchaseValue(r.action_values)
    const cpa = purchases > 0 ? r.spend / purchases : 0
    const roas = r.spend > 0 ? (value / r.spend) : 0

    const product = inferProduct(r.ad_name)
    const hit_type = classifyHit(product, ctr, cpc, cpa, purchases)

    return {
      date: r.date_start,
      campaign: r.campaign_name,
      ad_set: r.adset_name,
      ad_name: r.ad_name,
      product,
      spend_eur: r.spend,
      impressions,
      clicks,
      ctr,
      cpc_eur: cpc,
      purchases,
      purchase_value: value,
      cpa_eur: cpa,
      roas,
      hit_type
    }
  })

  // Upsert into Supabase
  const { error } = await supabaseAdmin.from('ad_insights').upsert(upserts, { onConflict: 'ad_name,date' })
  if (error) throw error

  return { inserted: upserts.length }
}
