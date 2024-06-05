<template>
  <b-overlay :show="visible" no-wrap></b-overlay>
</template>

<script setup lang="ts">
const props = defineProps({ visible: Boolean })
</script>
