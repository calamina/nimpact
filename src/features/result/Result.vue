<script setup lang="ts">
import { computed } from 'vue'
import BlockLayout from '@/components/layouts/BlockLayout.vue'
import type { Day } from '@/entities/Day'

const { day } = defineProps<{
  day: Day
}>()

const winner = computed(() => day.battle?.winner)
const outcome = computed(() => day.battle?.outcome)
const rewards = computed(() => day.battle?.rewards)

const MESSAGES = {
  victory: 'Victory !',
  stalemate: 'Their strength matches !',
  unfortunate: 'Everyone met an unfortunate end ...',
  _: '???',
} as const

const resultMessage = computed(() => MESSAGES[outcome.value ?? '_'])
</script>

<template>
  <div class="screen">
    <BlockLayout v-if="outcome === 'victory' && winner" class="victory">
      <div class="winner">
        <p>{{ resultMessage }}</p>
      </div>
      <div class="info">
        <p class="color-main">{{ winner.name }}</p>

        <div v-if="rewards?.item">
          <p class="low">They stole an item</p>
          <p>
            {{ rewards.item.name }}
            <span class="color-item">({{ rewards.item.value }} {{ rewards.item.type }})</span>
          </p>
        </div>

        <div v-if="rewards?.stat">
          <p class="low">They learned something</p>
          <p class="color-exp">({{ rewards.stat.value }} {{ rewards.stat.type }})</p>
        </div>
      </div>
    </BlockLayout>

    <BlockLayout v-else class="unfortunate">
      {{ resultMessage }}
    </BlockLayout>
  </div>
</template>

<style scoped>
.result {
  display: flex;
  flex-flow: column;
  align-items: center;
  width: 100%;
  /* background-color: #0000000a; */
}

/* .line {
  flex-shrink: 0;
  height: 2rem;
  width: 1px;
  background-color: #00000050;
  } */

.screen {
  /* background-color: #0000000a; */
  display: flex;
  /* width: 19.5rem; */
  width: fit-content;
  align-items: center;
  justify-content: center;
}

.victory {
  display: flex;
  flex-flow: column;
  width: 100%;
  /* padding: 1rem; */
  /* gap: 1rem; */
}

.info {
  display: flex;
  flex-flow: column;
  gap: 1rem;
  padding: 1rem;
}

.winner {
  text-align: center;
  padding: 1rem;
  background-color: #0000000a;
}

.unfortunate {
  text-align: center;
  text-wrap: balance;
  padding: 1rem;
}
</style>
