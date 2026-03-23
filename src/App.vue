<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { getRecords } from '@/store'

function toYaml(records: CostData[]): string {
  if (records.length === 0) return 'records: []\n'
  let yaml = 'records:\n'
  for (const r of records) {
    yaml += `  - payer: "${r.payer}"\n`
    yaml += `    amount: ${r.amount ?? 'null'}\n`
    yaml += `    currency: "${r.currency}"\n`
    yaml += `    what: "${r.what}"\n`
    yaml += `    shares:\n`
    for (const s of r.shares) {
      yaml += `      - who: "${s.who}"\n`
      yaml += `        amount: ${s.amount ?? 'null'}\n`
    }
  }
  return yaml
}

async function exportToClipboard() {
  const records = getRecords()
  const yaml = toYaml(records)
  await navigator.clipboard.writeText(yaml)
}
</script>

<template>
  <header class="flex justify-between items-center p-4 bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-white">
    <nav class="flex gap-4">
      <RouterLink to="/" class="btn p2">Home</RouterLink>
      <RouterLink to="/logs" class="btn p2">Logs</RouterLink>
    </nav>
    <button @click="exportToClipboard" class="bg-gray-300 hover:bg-gray-400 text-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white px-3 py-1 rounded text-sm">
      Export
    </button>
  </header>

  <RouterView />
</template>

<style scoped></style>
