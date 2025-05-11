<template>
  <div class="p-4 space-y-4 gap-4 flex flex-col">
    <div v-for="(cost, index) in costs" :key="index"
      class="border rounded-xl shadow-sm p-4 space-y-2 flex flex-row justify-between items-center text-gray-300">
      <div class="grow-1 flex-1">
        <div class="text-lg font-semibold">
          Payer: {{ cost.payer }} —
          <span class="text-green-600">
            {{ cost.amount ?? 'N/A' }} {{ cost.currency }}
          </span>
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
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'

const emit = defineEmits<{
  (e: 'remove', index: number): void;
}>();

const props = defineProps<{ costs: CostData[] }>()

function removeItem(index: number) {
  const { costs } = props

  // get confirmation from the user
  const confirmDelete = confirm(`Are you sure you want to delete this item?\r\n${costs[index].payer} paid ${costs[index].amount} ${costs[index].currency}`);
  if (!confirmDelete) return;

  // emit the remove event to the parent component
  emit('remove', index)
}

</script>

<style scoped>
/* Optional: Add custom styles here */
</style>
