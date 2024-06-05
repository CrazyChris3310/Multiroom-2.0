<template>
  <div>
    {{ headerText }}
    {{ header }}
    {{ items.length }}
    <ul>
      <li v-for="todo in items" v-bind:key="todo.text">
        <!--
        We have a slot for each todo, passing it the
        `todo` object as a slot prop.
        -->
        <slot name="tpl" v-bind="todo">
          <!-- Fallback content -->
          Fallback: {{ todo.text }}
        </slot>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  header: string
  items: Array<any>
}>()

function headerText(): string {
  return props.header
}
</script>
