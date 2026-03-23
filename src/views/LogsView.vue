<template>
  <div class="p-6 bg-gray-50 min-h-screen text-gray-800 dark:bg-gray-900 dark:text-gray-200">
    <h1 class="text-2xl font-bold mb-4">System Logs</h1>

    <div v-if="logs.length === 0" class="text-gray-500 dark:text-gray-400">No logs available.</div>

    <ul v-else class="space-y-4 flex flex-col gap-4">
      <li v-for="(log, index) in logs" :key="index" class="p-4 rounded border shadow" :class="logTypeClass(log.type)">
        <div class="flex justify-between items-center mb-2">
          <span class="font-semibold">{{ formatDate(log.date) }}</span>
          <span class="text-sm px-2 py-1 rounded-full text-white" :class="badgeClass(log.type)">
            {{ log.type.toUpperCase() }}
          </span>
        </div>
        <div class="mb-1 text-gray-800 dark:text-gray-100">{{ log.message }}</div>
        <pre class="bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300 p-2 rounded text-sm overflow-x-auto">
{{ formatData(log.data) }}
        </pre>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { getLogs } from '@/store'

const logs = ref<Log[]>(getLogs())

function formatDate(date: Date): string {
  return date.toLocaleString()
}

function formatData(data: object): string {
  return JSON.stringify(data, null, 2)
}

function logTypeClass(type: Log['type']): string {
  switch (type) {
    case 'info':
      return 'border-blue-300 bg-blue-50 dark:border-blue-500 dark:bg-blue-950'
    case 'warning':
      return 'border-yellow-300 bg-yellow-50 dark:border-yellow-500 dark:bg-yellow-900'
    case 'error':
      return 'border-red-300 bg-red-50 dark:border-red-500 dark:bg-red-900'
    default:
      return ''
  }
}

function badgeClass(type: Log['type']): string {
  switch (type) {
    case 'info':
      return 'bg-blue-600'
    case 'warning':
      return 'bg-yellow-600'
    case 'error':
      return 'bg-red-600'
    default:
      return ''
  }
}
</script>
