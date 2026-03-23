<template>
  <div class="p-4 max-w-md mx-auto">
    <h2 class="text-xl font-bold mb-4">EUR to GBP Rate</h2>
    <input v-model.number="eurToGbp" type="number" step="0.0001" min="0" class="border p-2 rounded w-full mb-6"
      placeholder="Enter EUR to GBP rate" />

    <h2 class="text-xl font-bold pt-10 mb-4">Payments Summary</h2>
    <div v-for="person in allPeople" :key="person" class="mb-2">
      <strong>{{ person }}</strong> paid: £{{ actualPaid[person]?.toFixed(2) || '0.00' }}
      (should be £{{ fairShare[person]?.toFixed(2) || '0.00' }})
    </div>

    <h2 class="text-xl font-bold pt-10 mb-4">Balances to Settle</h2>
    <div v-for="person in allPeople" :key="person" class="mb-1">
      <template v-if="balances[person] > 0">
        {{ person }} should receive: £{{ balances[person].toFixed(2) }}
      </template>
      <template v-else-if="balances[person] < 0">
        {{ person }} should pay: £{{ (-balances[person]).toFixed(2) }}
      </template>
      <template v-else>
        {{ person }} is settled.
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'

interface ExchangeRateResponse {
  rates: Record<string, number>
}

const props = defineProps<{
  costs: CostData[]
}>()

const eurToGbp = ref(0.85) // Default; will update via ECB

onMounted(async () => {
  try {
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/EUR')
    const json = await response.json() as ExchangeRateResponse
    eurToGbp.value = json.rates.GBP
  } catch (e) {
    console.error('Could not fetch exchange rate:', e)
  }
})

const allPeople = computed(() => {
  const people = new Set<string>()
  props.costs.forEach(cost => {
    people.add(cost.payer)
    cost.shares.forEach(share => people.add(share.who))
  })
  return Array.from(people)
})

// Correct: actual amount paid = total amount of bills they covered
const actualPaid = computed(() => {
  const result: Record<string, number> = {}
  props.costs.forEach(cost => {
    const rate = cost.currency === 'EUR' ? eurToGbp.value : 1
    const convertedAmount = (cost.amount ?? 0) * rate
    result[cost.payer] = (result[cost.payer] || 0) + convertedAmount
  })
  return result
})

// Correct: fair share is sum of shares for each person
const fairShare = computed(() => {
  const result: Record<string, number> = {}
  props.costs.forEach(cost => {
    const rate = cost.currency === 'EUR' ? eurToGbp.value : 1
    cost.shares.forEach(share => {
      const amount = (share.amount ?? 0) * rate
      result[share.who] = (result[share.who] || 0) + amount
    })
  })
  return result
})

const balances = computed(() => {
  const result: Record<string, number> = {}
  allPeople.value.forEach(person => {
    const paid = actualPaid.value[person] || 0
    const share = fairShare.value[person] || 0
    result[person] = parseFloat((paid - share).toFixed(2))
  })
  return result
})
</script>

<style scoped>
input {
  font-size: 1rem;
}
</style>
