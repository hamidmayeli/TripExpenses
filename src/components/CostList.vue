<template>
  <div class="p-4 space-y-4 gap-4 flex flex-col">
    <div v-for="(cost, index) in costs" :key="index" class="border rounded-xl shadow-sm p-4 space-y-2">
      <div class="text-lg font-semibold">
        Payer: {{ cost.payer }} —
        <span class="text-green-600">
          {{ cost.amount ?? 'N/A' }} {{ cost.currency }}
        </span>
      </div>
      <div class="flex gap-4">
        <div class="text-sm font-medium text-gray-100">Shares:</div>
        <ul class="flex gap-2 space-y-1">
          <li v-for="(share, i) in cost.shares" :key="i" class="text-gray-700">
            {{ share.who }}: {{ share.amount ?? 'N/A' }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'

const props = defineProps<{ costs: CostData[] }>()

console.log(JSON.stringify(props.costs))
// defineProps<{ costs: CostData[] }>()
</script>

<style scoped>
/* Optional: Add custom styles here */
</style>
