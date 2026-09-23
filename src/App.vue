<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useNimStore } from './store/nims'
import TimelineView from './features/Timeline/TimelineView.vue'
import { TIERS, type TierKey } from './models/nim.model.ts'
import NimWinner from './features/winner/NimWinner.vue'
import gsap from 'gsap'
import type { Pact } from './entities/Pact.ts'

const store = useNimStore()

onMounted(() => store.init())

const sortedTiers = computed(() => {
  return Object.keys(store.winnerQueue)
    .map(Number)
    .filter((tier) => (store.winnerQueue[tier]?.length ?? 0) > 0)
    .sort((a, b) => b - a) as TierKey[]
})

const hasWinners = computed(() => sortedTiers.value.length > 0)

const selectedNim = ref<Pact | null>(null)
const setSelectedNim = (nim: Pact) => (selectedNim.value = selectedNim.value === nim ? null : nim)

watch(store.winnerQueue, () => {
  let found: null | Pact = null
  for (const tier in store.winnerQueue) {
    const got = store.winnerQueue[tier]?.find((nim) => nim.id === selectedNim.value?.id)
    if (got) found = got
  }
  if (!found) selectedNim.value = null
})

watch(
  () => store.activeDay,
  (newDay) => {
    if (!newDay) return
    const container = document.querySelector('.days') as HTMLElement
    gsap.to(container, {
      scrollTo: 'max',
      duration: 0.4,
      delay: 0.1,
      ease: 'sine.out',
    })
  },
)
</script>

<template>
  <main>
    <section class="left">
      <div class="autofight">
        <button class="autobutton" :class="{ low: !store.autofight }" @click="store.setAutofight">
          autofight <span v-if="store.autofight" class="autoanim"></span>
        </button>
        <button class="autobutton" :class="{ low: !store.blitz }" @click="store.setBlitz">
          blitz <span v-if="store.blitz" class="autoanim"></span>
        </button>
      </div>
      <div class="days">
        <a
          v-for="day in store.days"
          class="day"
          :href="'#day' + day?.id"
          :class="{ 'day-high': day?.tier, 'day-low': day?.id !== store.activeDay?.id }"
        >
          Day {{ day?.id }} <span class="star" v-for="_ in day?.tier">✦</span>
        </a>
      </div>
    </section>

    <TimelineView />

    <section class="right">
      <div class="winners" v-if="hasWinners">
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
  grid-template-columns: 20% 60% 20%;
  height: 100svh;
  width: 100vw;
}

.left,
.right {
  position: sticky;
  top: 0;
  height: 100%;
  width: 100%;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-flow: column;
  gap: 1rem;
  background-color: #ffffff55;
  scrollbar-color: #00000020 transparent;
}

.left {
  align-items: flex-start;
}
.right {
  align-items: center;
}

.winners {
  display: flex;
  flex-flow: column;
  height: fit-content;
  padding: 1rem;
  gap: 1rem;
  width: 100%;
  flex-shrink: 0;
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

.autofight {
  display: flex;
  flex-flow: column;
  gap: 1ch;
}

.autobutton {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem 1rem;
  background-color: #0000000a;
  opacity: 1;
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
  overflow: scroll;
  overscroll-behavior: contain;
  width: 100%;
}

.day {
  display: flex;
  gap: 1ch;
  text-decoration: none;
  text-underline-offset: 4px;

  &.day-low {
    color: #00000060;
  }

  &.day-high {
    color: slateblue;
  }

  &:hover,
  &:focus-within,
  &:last-child {
    &::before {
      content: '→';
    }
  }
}

.star {
  display: inline-block;
  width: 0ch;
}
</style>
