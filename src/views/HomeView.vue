<script setup lang="ts">
import CostInput from '../components/CostInput.vue'
import CostList from '../components/CostList.vue';
import CostSummary from '../components/CostSummary.vue';
import { getRecords, removeRecord, updateRecord } from '@/store';
import { ref } from 'vue';

const costs = ref<CostData[]>(getRecords());

function handleSave(data: CostData) {
  costs.value.push(data);
}

function handleRemove(index: number) {
  removeRecord(index);
  costs.value = getRecords();
}

function handleUpdate(index: number, data: CostData) {
  updateRecord(index, data);
  costs.value = getRecords();
}

</script>

<template>
  <main>
    <CostInput v-on:save="handleSave" />
    <CostList :costs="costs" v-on:remove="handleRemove" v-on:update="handleUpdate" />
    <CostSummary :costs="costs" />
  </main>
</template>
