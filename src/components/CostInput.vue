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
        <input type="text" v-model.what="what" class="border p-1" />
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
      <p>Shares</p>
      <div v-for="(share, index) in shares" :key="index" class="flex flex-wrap gap-4 mt-2 items-center border-t-2 py-2">
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

    <!-- Add Share -->
    <button @click="addShare" class="text-blue-600 underline">+ new item</button>

    <!-- Save -->
    <div>
      <button @click="save" class="bg-green-600 text-white px-3 py-1 rounded">Save</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { saveRecord } from '@/store'

const emit = defineEmits<{
  (e: 'save', data: CostData): void;
}>();

const payer = ref('');
const amount = ref<number | null>(null);
const currency = ref('EUR');
const currencies = ['EUR', 'GBP'];
const what = ref('');

const shares = ref<Share[]>([
  { who: '', amount: null }
]);

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
    saveRecord(record);

    emit('save', record);

    // Reset the form
    payer.value = '';
    amount.value = null;
    currency.value = 'EUR';
    what.value = '';
    shares.value = [{ who: '', amount: null }];
  } catch (error) {
    alert('Error saving record\r\n' + error);
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
