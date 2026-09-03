<script setup lang="ts">
import { useTimelineTransition } from '@/composables/appTransitions'
const { timelineBeforeEnter, timelineEnter } = useTimelineTransition()

const { appear, group } = defineProps<{ appear?: boolean; group?: boolean }>()
</script>

<template>
  <Transition
    v-if="!group"
    :css="false"
    @before-enter="timelineBeforeEnter"
    @enter="timelineEnter"
    :appear
  >
    <slot />
  </Transition>
  <TransitionGroup
    v-else
    :css="false"
    @before-enter="timelineBeforeEnter"
    @enter="timelineEnter"
    :appear
  >
    <slot />
  </TransitionGroup>
</template>
