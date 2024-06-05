<template>
  <BOverlay :show="busy" no-wrap fixed @shown="onShown" @hidden="onHidden" z-index="5000">
    <template v-slot:overlay>
      <div v-if="processing" class="text-center p-4 bg-primary text-light rounded">
        <!-- <BIcon icon="cloud-upload" font-scale="4"></BIcon> -->
        <div class="mb-3">Processing...</div>
        <BProgress
          min="1"
          max="20"
          :value="counter"
          variant="success"
          height="3px"
          class="mx-n4 rounded-0"
        ></BProgress>
      </div>
      <div
        v-else
        ref="dialog"
        tabindex="-1"
        role="dialog"
        aria-modal="false"
        aria-labelledby="form-confirm-label"
        class="text-center p-3"
      >
        <p><strong id="form-confirm-label">Are you sure?</strong></p>
        <div class="d-flex">
          <BButton variant="outline-danger" class="mr-3" @click="onCancel">Cancel</BButton>
          <BButton variant="outline-success" @click="onOK">OK</BButton>
        </div>
      </div>
    </template>
  </BOverlay>
</template>

<script setup lang="ts">
import type { Ref } from 'vue'
import { ref, nextTick } from 'vue'
import type DeferredPromise from '../DeferredPromise'
import { deferred } from '../DeferredPromise'
import { SubmissionContext } from './data'

const busy = ref(false)
const processing = ref(false)
const counter = ref(1)
const interval = ref()

const _context = ref(new SubmissionContext())
const _currentPromise: Ref<DeferredPromise<void>> = ref(deferred<void>())

const dialog: Ref<unknown> = ref()

defineExpose({ doShow, doFinish })

function beforeDestroy() {
  cleanupInterval()
}

function cleanupInterval() {
  if (interval.value) {
    clearInterval(interval.value)
    interval.value = null
  }
}

async function onShown() {
  const dialogVar = dialog.value as HTMLElement
  if (dialogVar !== undefined) {
    ;(dialog.value as HTMLElement).focus() // Focus the dialog prompt
  }
}

function onHidden() {
  // In this case, we return focus to the submit button
  // You may need to alter this based on your application requirements
  // this.$refs.submit.focus()
  if (processing.value) {
    if (_context.value.successCallback) {
      _context.value.successCallback()
    }
  } else {
    if (_context.value.cancelCallback) {
      _context.value.cancelCallback()
    }
  }
  _currentPromise.value.resolve()
}

function onSubmit() {
  processing.value = false
  busy.value = true
}

function onCancel() {
  busy.value = false
}

function onOK() {
  counter.value = 1
  processing.value = true
  // Simulate an async request
  cleanupInterval()
  interval.value = setInterval(() => {
    if (counter.value < 20) {
      counter.value += 1
    } else {
      // this.onFinish()
      counter.value = 1
    }
  }, 350)

  if (_context.value.confirmationCallback) {
    _context.value.confirmationCallback()
  }
}

function onFinish() {
  cleanupInterval()
  nextTick(() => {
    busy.value = processing.value = false
  })
}

function doShow(context?: SubmissionContext): Promise<void> {
  _currentPromise.value = deferred<void>()
  _context.value = context ?? new SubmissionContext()
  if (_context.value.confirmationCallback) {
    onSubmit()
  } else {
    busy.value = true
    onOK()
  }
  return _currentPromise.value
}

function doFinish() {
  onFinish()
}
</script>
