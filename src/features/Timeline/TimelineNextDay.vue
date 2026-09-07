<script setup lang="ts">
import { useNimStore, type Day } from '@/store/nims'
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
} as const

const store = useNimStore()

const outcome = computed(() => day.outcome)
const message = computed(() => MESSAGES[outcome.value])

const next = async () => {
  nexted.value = true
  await new Promise((r) => setTimeout(r, 1000))
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
  <div class="next">
    <div class="line"></div>
    <button v-if="!nexted" class="box" @click="next()">Start the next day</button>
    <p class="box" v-else>{{ message }}</p>
  </div>
</template>

<style scoped>
.next {
  height: 100%;
  display: grid;
  width: 24rem;
  grid-template-rows: 2rem auto;
  place-items: center;
}

button,
p {
  padding: 1rem;
}

.line {
  height: 100%;
  width: 1px;
  background-color: #00000035;
}
</style>
