<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useNimStore } from './store/nims'
import TimelineView from './features/Timeline/TimelineView.vue'
import type { Nimpacter } from './models/nim.model.ts'
import NimWinner from './features/winner/NimWinner.vue'

const store = useNimStore()

onMounted(() => store.init())

const TIERS = {
  1: 'Winners',
  2: 'Champions',
  3: 'Heroes',
  4: 'Legends',
  5: 'Demi-gods',
  6: '???',
} as const

type TierKey = keyof typeof TIERS

const sortedTiers = computed(() => {
  return Object.keys(store.winnerQueue)
    .map(Number)
    .filter((tier) => (store.winnerQueue[tier]?.length ?? 0) > 0)
    .sort((a, b) => b - a) as TierKey[]
})

const hasWinners = computed(() => sortedTiers.value.length > 0)

const selectedNim = ref<Nimpacter | null>(null)
const setSelectedNim = (nim: Nimpacter) =>
  (selectedNim.value = selectedNim.value === nim ? null : nim)

watch(store.winnerQueue, () => {
  let found: null | Nimpacter = null
  for (const tier in store.winnerQueue) {
    const got = store.winnerQueue[tier]?.find((nim) => nim.id === selectedNim.value?.id)
    if (got) found = got
  }
  if (!found) selectedNim.value = null
})
</script>

<template>
  <main>
    <section class="left">
      <div class="autofight">
        <button
          class="autobutton box"
          :class="{ low: !store.autofight }"
          @click="store.setAutofight"
        >
          autofight <span v-if="store.autofight" class="autoanim"></span>
        </button>
      </div>
      <div class="days">
        <div
          v-for="day in store.days"
          class="day"
          :class="{ 'color-main': day?.tier, low: day?.id !== store.currentDay?.id }"
        >
          <a :href="'#day' + day?.id"> Day {{ day?.id }} </a>
          <p><span v-for="_ in day?.tier">*</span></p>
        </div>
      </div>
    </section>

    <TimelineView />

    <section class="right">
      <div class="winners box" v-if="hasWinners">
        <div v-for="tier in sortedTiers" :key="tier" class="tier">
          <p class="low">{{ TIERS[tier] }} ({{ tier }} wins)</p>
          <button v-for="nim in store.winnerQueue[tier]" :key="nim.id" @click="setSelectedNim(nim)">
            {{ nim.name }}
          </button>
        </div>
      </div>
      <NimWinner v-if="selectedNim" :nim="selectedNim" />
    </section>
  </main>
</template>

<style scoped>
main {
  display: grid;
  grid-template-columns: 20vw 60vw 20vw;
}

.left,
.right {
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
  padding: 1rem;
}

.left {
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  gap: 1rem;
  width: fit-content;
}
.right {
  display: flex;
  flex-flow: column;
  gap: 1rem;
  justify-content: center;
  align-items: center;
}

.winners {
  display: flex;
  flex-flow: column;
  height: fit-content;
  padding: 1rem;
  gap: 1rem;
}

.tier-group {
  display: flex;
  flex-flow: column;
  gap: 0.5rem;
}

.tier {
  display: flex;
  flex-flow: column;
  width: 100%;

  button {
    text-align: start;
  }
}

.autobutton {
  display: flex;
  align-items: center;
  padding: 0.25rem 1rem;
  gap: 1rem;
  &:hover,
  &:focus-within {
    opacity: 1;
  }
}

.autoanim {
  display: inline-flex;
  height: 0.5rem;
  width: 0.5rem;
  background-color: slateblue;
  transform: rotate(45deg);
  animation: autoscroll 1.5s cubic-bezier(0.6, 0, 0.6, 1) infinite;
}

@keyframes autoscroll {
  0% {
    transform: rotate(45deg);
  }
  100% {
    transform: rotate(405deg);
  }
}

.days {
  display: flex;
  flex-flow: column;
  gap: 0.25rem;
  padding: 1rem;
  overflow: scroll;
  overscroll-behavior: contain;
  width: 100%;
}

.day {
  display: flex;
  gap: 1ch;

  a {
    text-decoration-color: #00000035;
  }

  /* opacity: 0.35; */
  &:hover,
  &:focus-within {
    opacity: 1;
  }
}
</style>
