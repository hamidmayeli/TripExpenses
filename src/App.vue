<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header class="flex justify-between items-center p-4 bg-gray-800 text-white">
    <nav class="flex gap-4">
      <RouterLink to="/" class="btn p2">Home</RouterLink>
      <RouterLink to="/about" class="btn p2">About</RouterLink>
    </nav>
  </header>

  <RouterView />
</template>

<style scoped></style>
