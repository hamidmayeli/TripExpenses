type Share = {
  who: string
  amount: number | null
}

type CostData = {
  payer: string
  amount: number | null
  currency: string
  what: string
  shares: Share[]
}
