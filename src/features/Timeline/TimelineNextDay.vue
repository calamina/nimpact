<script setup lang="ts">
import BlockLayout from '@/components/layouts/BlockLayout.vue'
import type { Day } from '@/entities/Day'
import { useNimStore } from '@/store/nims'
import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/all'
import { computed, onMounted, ref } from 'vue'

gsap.registerPlugin(ScrollToPlugin)

const { day } = defineProps<{
  day: Day
}>()

const nexted = ref(false)

const MESSAGES = {
  victory: 'The winner went home to rest',
  stalemate: 'They fell in love !!',
  unfortunate: 'They were brave fighters',
  _: '???',
} as const

const store = useNimStore()

const outcome = computed(() => day.battle?.outcome)
const message = computed(() => MESSAGES[outcome.value ?? '_'])

const next = async () => {
  nexted.value = true
  // Holy shit this makes blitz go TURBO
  if (!store.blitz) await new Promise((r) => setTimeout(r, 1000))
  // Slows down the beast
  // if (store.blitz) await new Promise((r) => setTimeout(r, 300))
  store.startNewDay()
  gsap.to(window, {
    scrollTo: 'max',
    duration: 0.4,
    delay: 0.1,
    ease: 'sine.out',
  })
}

onMounted(() => {
  if (store.autofight) next()
})
</script>

<template>
  <BlockLayout class="next">
    <button v-if="!nexted" @click="next()">Start the next day</button>
    <div class="finished" v-else>
      <p class="ended">The day has ended ...</p>
      <p>{{ message }}</p>
    </div>
  </BlockLayout>
</template>

<style scoped>
.next {
  height: 100%;
  display: grid;
  width: 24rem;
  place-items: center;
}

.finished {
  display: flex;
  flex-flow: column;
  width: 100%;
  align-items: center;
}

.ended {
  background-color: #0000000a;
}

button,
p {
  padding: 1rem;
  width: 100%;
}

button {
  display: flex;
  gap: 2ch;
  align-items: center;
  justify-content: center;
  background-color: #6a5acd44;
  transition: gap 0.125s ease-out;

  &:hover,
  &:focus-within {
    gap: 3ch;
  }

  &::before,
  &::after {
    content: '▪';
    color: slateblue;
  }
}

p {
  text-align: center;
}
</style>
