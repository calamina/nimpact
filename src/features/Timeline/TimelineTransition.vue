<script setup lang="ts">
import { useTimelineTransition } from '@/composables/appTransitions'
import { computed } from 'vue'
const { timelineBeforeEnter, timelineEnter, timelineEnterNoscroll } = useTimelineTransition()

const { appear, noscroll } = defineProps<{ appear?: boolean; noscroll?: boolean }>()

const enter = computed(() => (noscroll ? timelineEnterNoscroll : timelineEnter))
</script>

<template>
  <Transition :css="false" @before-enter="timelineBeforeEnter" @enter="enter" :appear>
    <!-- @enter="noscroll ? timelineEnterNoscroll : timelineEnter" -->
    <slot />
  </Transition>
</template>
