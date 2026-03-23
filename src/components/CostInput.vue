<template>
  <div class="p-4 space-y-4">
    <!-- Top Section: Payer, Amount, Currency -->
    <div class="flex gap-4 items-center flex-wrap">
      <label class="flex flex-col">
        Who paid
        <input v-model="payer" class="border p-1" />
      </label>
      <label class="flex flex-col">
        Amount
        <input type="number" v-model.number="amount" class="border p-1" />
      </label>
      <label class="flex flex-col">
        What
        <input type="text" v-model="what" class="border p-1" />
      </label>
      <label class="flex flex-col">
        Currency
        <select v-model="currency" class="border p-1">
          <option v-for="c in currencies" :key="c" :value="c" class="text-gray-700">{{ c }}</option>
        </select>
      </label>
    </div>

    <!-- Shares Section -->
    <div>
      <p class="border-b-2">Shares (remaining {{ remaining }})</p>
      <div v-for="(share, index) in shares" :key="index" class="flex flex-wrap gap-4 mt-2 items-center py-2">
        <label class="flex flex-col">
          Who
          <input v-model="share.who" class="border p-1" />
        </label>
        <label class="flex flex-col">
          How much
          <input type="number" v-model.number="share.amount" class="border p-1" />
        </label>
        <button @click="removeShare(index)" class="text-red-500">✖</button>
      </div>
    </div>

    <div class="flex gap-4 items-center">
      <button @click="addShare" class="bg-gray-600 text-white px-3 py-1 rounded">+ new item</button>
      <button @click="save" class="bg-green-600 text-white px-3 py-1 rounded">Save</button>
      <button v-if="editData" @click="emit('cancel')" class="bg-gray-600 text-white px-3 py-1 rounded">Cancel</button>
    </div>
    <ConfirmDialog ref="dialog" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { saveRecord, validateRecord } from '@/store'
import ConfirmDialog from './ConfirmDialog.vue'

const props = defineProps<{
  editData?: CostData
}>()

const emit = defineEmits<{
  (e: 'save', data: CostData): void
  (e: 'cancel'): void
}>();

const payer = ref('');
const amount = ref<number | null>(null);
const currency = ref('EUR');
const currencies = ['EUR', 'GBP'];
const what = ref('');
const remaining = computed(() => {
  return (amount.value ?? 0) - shares.value.reduce((acc, share) => acc + (share.amount || 0), 0);
});

const dialog = ref<InstanceType<typeof ConfirmDialog>>()

const shares = ref<Share[]>([
  { who: '', amount: null }
]);

watch(() => props.editData, (data) => {
  if (data) {
    payer.value = data.payer
    amount.value = data.amount
    currency.value = data.currency
    what.value = data.what
    shares.value = data.shares.map((s) => ({ ...s }))
  }
}, { immediate: true })

function addShare() {
  shares.value.push({ who: '', amount: null });
}

function removeShare(index: number) {
  shares.value.splice(index, 1);
}

function save() {
  const record = {
    payer: payer.value,
    amount: amount.value,
    currency: currency.value,
    what: what.value,
    shares: shares.value,
  };

  try {
    validateRecord(record);

    if (!props.editData) {
      saveRecord(record);
    }

    emit('save', record);

    if (!props.editData) {
      // Reset the form only in create mode
      payer.value = '';
      amount.value = null;
      currency.value = 'EUR';
      what.value = '';
      shares.value = [{ who: '', amount: null }];
    }
  } catch (error) {
    dialog.value?.alert('Error saving record\n' + error);
    return;
  }
}
</script>

<style scoped>
input,
select {
  width: 120px;
}
</style>
