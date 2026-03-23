<template>
  <Teleport to="body">
    <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" @click.self="cancel">
      <div class="bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-200 rounded-xl shadow-lg p-6 max-w-sm w-full mx-4 space-y-4">
        <p class="whitespace-pre-line">{{ message }}</p>
        <div class="flex justify-end gap-3">
          <button v-if="showCancel" @click="cancel"
            class="px-4 py-1.5 rounded bg-gray-300 hover:bg-gray-400 text-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
            Cancel
          </button>
          <button @click="ok"
            class="px-4 py-1.5 rounded text-white"
            :class="confirmClass">
            {{ confirmLabel }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(false)
const message = ref('')
const showCancel = ref(true)
const confirmLabel = ref('OK')
const confirmClass = ref('bg-red-600 hover:bg-red-500')

let resolveFn: ((value: boolean) => void) | null = null

function confirm(msg: string, label = 'Delete', btnClass = 'bg-red-600 hover:bg-red-500'): Promise<boolean> {
  message.value = msg
  showCancel.value = true
  confirmLabel.value = label
  confirmClass.value = btnClass
  visible.value = true
  return new Promise((resolve) => { resolveFn = resolve })
}

function alert(msg: string): Promise<boolean> {
  message.value = msg
  showCancel.value = false
  confirmLabel.value = 'OK'
  confirmClass.value = 'bg-blue-600 hover:bg-blue-500'
  visible.value = true
  return new Promise((resolve) => { resolveFn = resolve })
}

function ok() {
  visible.value = false
  resolveFn?.(true)
  resolveFn = null
}

function cancel() {
  visible.value = false
  resolveFn?.(false)
  resolveFn = null
}

defineExpose({ confirm, alert })
</script>
