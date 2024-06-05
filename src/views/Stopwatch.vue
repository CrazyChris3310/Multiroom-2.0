<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div>
    <span>{{ hours }}</span>
    <span>{{ minutes }}</span>
    <span>{{ seconds }}</span>
  </div>
</template>

<script setup lanuage="ts">
import { onMounted, ref } from 'vue';

const hours = ref(0)
const minutes = ref(0)
const seconds = ref(0)

onMounted(() => {
    
})
</script>

<style></style>
