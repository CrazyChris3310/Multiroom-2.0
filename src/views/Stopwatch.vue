<!-- eslint-disable vue/multi-word-component-names -->
<template>
   {{ hours }}:{{ minutes }}:{{ seconds }}
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

const props = defineProps({startStamp: Number})

const hours = ref('')
const minutes = ref('')
const seconds = ref('')

onMounted(() => {
    start()
})

function start() {
    setInterval(function() {
        var sinceLaunch = new Date(dateToUtc(new Date()).getTime() - props.startStamp!);

        seconds.value = toString(sinceLaunch.getSeconds())
        minutes.value = toString(sinceLaunch.getUTCMinutes());
        hours.value = toString(sinceLaunch.getUTCHours());
    }, 1000)   
}

function toString(time: number) {
    return time > 0 ? '' + time : '0' + time
}

function dateToUtc(date: Date) {
    var now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(),
                    date.getUTCDate(), date.getUTCHours(),
                    date.getUTCMinutes(), date.getUTCSeconds());
    return new Date(now_utc)
}

</script>

<style></style>
