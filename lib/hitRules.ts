export type Product = 'Go-Tone' | 'SwimComm' | 'FreeSwim' | 'Unknown'

export function inferProduct(adName: string): Product {
  const n = adName.toLowerCase()
  if (n.includes('swimcomm') || n.includes('t6') || n.includes('bluetooth') || n.includes('swim')) return 'SwimComm'
  if (n.includes('freeswim') || n.includes('w26')) return 'FreeSwim'
  if (n.includes('go-tone') || n.includes('gotone') || n.includes('gym')) return 'Go-Tone'
  return 'Unknown'
}

export function classifyHit(product: Product, ctrPct: number, cpc: number, cpa: number, purchases: number) {
  // Thresholds
  const cpaThreshold = product === 'SwimComm' ? 20 : 40

  const isFullHit = ctrPct >= 2.0 && cpc <= 0.80 && (cpa > 0 ? cpa < cpaThreshold : purchases >= 2)
  const isSoftHit = purchases >= 1 || (ctrPct >= 2.5 && cpc <= 1.0)

  if (isFullHit) return 'Full Hit'
  if (isSoftHit) return 'Soft Hit'
  return 'Miss'
}
