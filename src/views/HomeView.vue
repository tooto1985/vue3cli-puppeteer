<script setup>
import TheWelcome from '../components/TheWelcome.vue'
import { setTitle, addMeta } from '@/utils/seo'
import { onMounted } from 'vue'

onMounted(() => {
  setTitle('家頁面')
  addMeta('name', 'description', '家頁面的說明')
})
</script>



<template>
  <main>
    <TheWelcome />
  </main>
</template>
