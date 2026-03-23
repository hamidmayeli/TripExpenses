<template>
  <div class="p-4 space-y-4 gap-4 flex flex-col">
    <div v-for="(cost, index) in costs" :key="index"
      class="border rounded-xl shadow-sm p-4 space-y-2 flex flex-row justify-between items-center text-gray-300">
      <div class="grow-1 flex-1">
        <div class="text-lg font-semibold">
          {{ cost.payer }} —
          <span class="text-green-600">
            {{ cost.amount ?? 'N/A' }} {{ cost.currency }}
	          </span>
          ({{ cost.what }})
        </div>
        <div class="flex gap-4">
          <div class="text-sm font-medium text-gray-500">Shares:</div>
          <ul class="flex gap-2 space-y-1">
            <li v-for="(share, i) in cost.shares" :key="i" class="text-gray-400">
              {{ share.who }}: {{ share.amount ?? 'N/A' }},
            </li>
          </ul>
        </div>
      </div>
      <div>
        <button @click="removeItem(index)" class="text-red-500">✖</button>
      </div>
    </div>
    <ConfirmDialog ref="dialog" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import ConfirmDialog from './ConfirmDialog.vue'

const emit = defineEmits<{
  (e: 'remove', index: number): void;
}>();

const props = defineProps<{ costs: CostData[] }>()
const dialog = ref<InstanceType<typeof ConfirmDialog>>()

async function removeItem(index: number) {
  const { costs } = props
  const confirmed = await dialog.value?.confirm(
    `Are you sure you want to delete this item?\n${costs[index].payer} paid ${costs[index].amount} ${costs[index].currency}`
  )
  if (!confirmed) return

  emit('remove', index)
}

</script>

<style scoped>
/* Optional: Add custom styles here */
</style>
