<template>
  <div class="hello">
    <ListBox v-bind:header="customHeader" :items="todos" ref="lst">
      <template v-slot:tpl="ctx">
        <span v-if="ctx.isComplete">✓</span>
        [{{ ctx.text }}]
      </template>
    </ListBox>
  </div>
</template>

<script setup lang="ts">
import type { Ref } from 'vue'
import { ref, nextTick } from 'vue'
// import { Component, Prop, Vue } from 'vue-property-decorator'
import ListBox from '../controls/ListBox.vue'

const props = defineProps({ msg: String })

const customHeader = 'ToDos'

const todos = ref([
  { isComplete: true, text: 'abcdee' },
  { isComplete: true, text: '1234246' },
  { isComplete: false, text: 'zxczxvcb' },
  { isComplete: true, text: '0987' }
])
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
