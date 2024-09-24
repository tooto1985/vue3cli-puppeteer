<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
</template>

<script setup>
import { setTitle, addMeta } from '@/utils/seo'
import { onMounted } from 'vue'

onMounted(() => {
  setTitle('關於')
  addMeta('name', 'description', '關於頁的說明')
})
</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
