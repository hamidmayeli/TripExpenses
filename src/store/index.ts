const saveRecord = (record: CostData) => {
  validateRecord(record)

  const records = JSON.parse(localStorage.getItem('records') || '[]') as CostData[]
  records.push(record)
  localStorage.setItem('records', JSON.stringify(records))
}

const validateRecord = (record: CostData) => {
  // All fields are required
  if (!record.payer || !record.amount || !record.currency || !record.what || !record.shares) {
    throw new Error('All fields are required')
  }

  // Validate shares
  record.shares.forEach((share) => {
    if (!share.who || share.amount === null) {
      throw new Error('All fields are required')
    }
  })

  // Validate amount (record.amount should be equal to the sum of shares)
  const totalShares = record.shares.reduce((acc, share) => acc + (share.amount || 0), 0)
  if (record.amount !== totalShares) {
    throw new Error('The total amount should be equal to the sum of shares')
  }
}

const getRecords = () => {
  return JSON.parse(localStorage.getItem('records') || '[]') as CostData[]
}

const removeRecord = (index: number) => {
  const records = JSON.parse(localStorage.getItem('records') || '[]') as CostData[]
  records.splice(index, 1)
  localStorage.setItem('records', JSON.stringify(records))
}

export { saveRecord, getRecords, removeRecord }
