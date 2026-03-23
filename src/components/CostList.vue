<template>
  <div class="p-4 space-y-4 gap-4 flex flex-col">
    <div v-for="(cost, index) in costs" :key="index"
      class="border rounded-xl shadow-sm p-4 space-y-2"
      :class="editIndex !== index ? 'text-gray-300' : ''">

      <!-- View mode -->
      <template v-if="editIndex !== index">
        <div class="flex flex-row justify-between items-center">
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
          <div class="flex gap-2">
            <button @click="startEdit(index)" class="text-blue-400">✎</button>
            <button @click="removeItem(index)" class="text-red-500">✖</button>
          </div>
        </div>
      </template>

      <!-- Edit mode -->
      <template v-else>
        <CostInput :edit-data="draft" @save="(data) => saveEdit(index, data)" @cancel="cancelEdit" />
      </template>

    </div>
    <ConfirmDialog ref="dialog" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import ConfirmDialog from './ConfirmDialog.vue'
import CostInput from './CostInput.vue'

const emit = defineEmits<{
  (e: 'remove', index: number): void
  (e: 'update', index: number, data: CostData): void
}>()

const props = defineProps<{ costs: CostData[] }>()
const dialog = ref<InstanceType<typeof ConfirmDialog>>()

const editIndex = ref<number | null>(null)
const draft = ref<CostData>({ payer: '', amount: null, currency: 'EUR', what: '', shares: [] })

function startEdit(index: number) {
  const cost = props.costs[index]
  draft.value = {
    payer: cost.payer,
    amount: cost.amount,
    currency: cost.currency,
    what: cost.what,
    shares: cost.shares.map((s) => ({ ...s })),
  }
  editIndex.value = index
}

function cancelEdit() {
  editIndex.value = null
}

function saveEdit(index: number, data: CostData) {
  emit('update', index, data)
  editIndex.value = null
}

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
