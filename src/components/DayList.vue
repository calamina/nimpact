<script setup lang="ts">
import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/all'
import { ref } from 'vue'
import { useStore } from '@/composables/useStore'
import DayCard from './DayCard.vue'

gsap.registerPlugin(ScrollToPlugin)
const store = useStore()
const list = ref<HTMLElement | null>(null)

const scroll = (targetEl: HTMLElement) => {
  if (!list.value || !targetEl) return

  gsap.to(list.value, {
    scrollTo: {
      y: targetEl,
      offsetY: list.value.clientHeight / 2 - targetEl.clientHeight / 2,
      autoKill: true,
    },
    delay: 0.15,
    duration: 0.4,
    ease: 'sine.out',
  })
}
</script>

<template>
  <section ref="list">
    <DayCard v-for="day in store.days" :key="day.id" :day="day" @phase-changed="scroll" />
  </section>
</template>

<style scoped>
section {
  width: 100%;
  height: 100svh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  /* padding-bottom: 100svh;  */
  gap: 6rem;
  overflow-y: auto;
  border-radius: 8px;
  scrollbar-color: #00000020 transparent;
  box-sizing: border-box;

  &::after {
    content: '';
    display: block;
    height: 50svh;
    width: 100%;
    flex-shrink: 0;
  }
}
</style>
