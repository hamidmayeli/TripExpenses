<script setup lang="ts">
import CostInput from '../components/CostInput.vue'
import CostList from '../components/CostList.vue';
import CostSummary from '../components/CostSummary.vue';
import { getRecords } from '@/store';
import { ref } from 'vue';

const costs = ref<CostData[]>(getRecords());

console.log('Costs:', costs.value);

function handleSave(data: CostData) {
  costs.value.push(data);
}

</script>

<template>
  <main>
    <CostInput v-on:save="handleSave" />
    <CostList :costs="costs" />
    <CostSummary :costs="costs" />
  </main>
</template>
