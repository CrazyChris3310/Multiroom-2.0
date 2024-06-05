<template>
  <div class="aboutContent">
    <h1>
      {{ title }}
    </h1>

    <div class="blocktext">
      <BSpinner label="Spinning"></BSpinner>
    </div>

    <div class="blocktext" style="font-weight: bolder; text-align: center; color: #aecf00">
      Please wait
    </div>
  </div>
</template>

<script setup lang="ts">
import api from '../api'
import { nextTick, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'bootstrap-vue-next'

const working = ref(true)
const title = ref('Arranging action to perform...')

const router = useRouter()
const currentRoute = useRoute()
const toast = useToast()

async function onMounted() {
  try {
    const action = currentRoute.query.action as string
    const key = currentRoute.query.key as string

    title.value = 'Performing requested action...'

    switch (action) {
      case 'activate':
        await api.performActivateAction(key)
        break
      case 'restore':
        await api.performRestoreAccessAction(key)
        break
      default:
        throw new Error('Unknown action ' + action)
    }

    title.value = 'Requested action successed'

    await nextTick()
    await router.push('/app/profile')
  } catch (err) {
    title.value = 'Requested action failed'
    await nextTick()

    toast.show?.({
      props: {
        body: (err as Error).message,
        title: 'Error opening topic',
        variant: 'warning',
        solid: true
      }
    })
    working.value = false
  } finally {
    working.value = false
  }
}
</script>
