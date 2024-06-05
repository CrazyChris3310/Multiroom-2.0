<template>
  <div>
    <BListGroup id="list">
      <BListGroupItem
        class="flex-column align-items-start"
        v-for="item in itemsSource"
        v-bind:key="item.key()"
        @click="onItemClick($event, item)"
      >
        <BContainer class="bv-example-row">
          <BRow>
            <BCol @click="onTitleClick(item)"
              ><h5><slot name="title" v-bind="item" /></h5
            ></BCol>
            <BCol><slot name="titleStatus" v-bind="item" /></BCol>
          </BRow>
          <BRow>
            <BCol><slot name="content" v-bind="item" /></BCol>
            <BCol><slot name="contentStatus" v-bind="item" /></BCol>
          </BRow>
          <BRow>
            <BCol
              ><small><slot name="tags" v-bind="item" /></small
            ></BCol>
            <BCol
              ><small><slot name="tagsStatus" v-bind="item" /></small
            ></BCol>
          </BRow>
        </BContainer>
      </BListGroupItem>
    </BListGroup>
  </div>
</template>

<script setup lang="ts">
import { ListViewItem } from '@/components/data'

const props = defineProps<{ itemsSource: Array<ListViewItem> }>()

// const props = defineProps<>({
//   itemsSource: {
//     Array<T extends ListViewItem>
//   }
//   });

const emit = defineEmits(['titleClick', 'itemClick'])

function onTitleClick(item: ListViewItem) {
  try {
    emit('titleClick', item)
  } catch (er) {
    console.error('onTitleClick handler failed with ' + er)
  }
}

function onItemClick(event: MouseEvent, item: ListViewItem) {
  try {
    if (event.target instanceof HTMLDivElement) {
      emit('itemClick', item)
    }
  } catch (er) {
    console.error('onItemClick handler failed with ' + er)
  }
}
</script>

<style lang="scss">
#table {
  .input-group-text {
    padding: 0 0.5em 0 0.5em;

    .fa {
      font-size: 12px;
    }
  }
}
</style>
