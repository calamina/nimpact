<script setup lang="ts">
import BlockLayout from '@/components/layouts/BlockLayout.vue'
import type { Day } from '@/entities/Day'
import { TIERS, type TierKey } from '@/models/nim.model'
import gsap from 'gsap'
import { onMounted } from 'vue'
const { day } = defineProps<{ day: Day }>()

onMounted(() => {
  const container = document.querySelector('.timeline-view') as HTMLElement

  if (container) {
    gsap.to(container, {
      paddingBottom: `${window.innerHeight * 0.4}px`,
      duration: 0.2,
      ease: 'power2.out',
    })
  }

  gsap.to(container, {
    scrollTo: 'max',
    duration: 0.4,
    delay: 0.1,
    ease: 'sine.out',
  })
})
</script>

<template>
  <BlockLayout class="block">
    <h2 class="day" :id="'day' + day.id">
      <span class="title">Day {{ day.id }}</span>
      <span v-if="day.tier" class="color-main">✦ {{ TIERS[day.tier as TierKey] }} fight ✦</span>
    </h2>
  </BlockLayout>
</template>

<style scoped>
.block {
  padding: 1rem;
}

h2 {
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  min-width: 8rem;
  gap: 1ch;
  scroll-margin-top: 2rem;
}

.title {
  font-size: 2rem;
  line-height: 2rem;
}
</style>
