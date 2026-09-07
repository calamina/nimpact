<script setup lang="ts">
import { computed } from 'vue'
import type { Day } from '@/store/nims'

const { day } = defineProps<{
  day: Day
}>()

const winner = computed(() => day.winner)
const outcome = computed(() => day.outcome)
const rewards = computed(() => day.rewards)

const MESSAGES = {
  victory: 'Victory !',
  stalemate: 'Their strength matches !',
  unfortunate: 'Everyone met an unfortunate end ...',
} as const

const resultMessage = computed(() => MESSAGES[outcome.value])
</script>

<template>
  <div class="result">
    <div class="line"></div>
    <div class="screen box">
      <div v-if="outcome === 'victory' && winner" class="victory">
        <p class="winner">{{ resultMessage }}</p>
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
            <p class="color-exp">+ {{ rewards.stat.value }} {{ rewards.stat.type }}</p>
          </div>
        </div>
      </div>

      <p v-else class="unfortunate">
        {{ resultMessage }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.result {
  display: flex;
  flex-flow: column;
  align-items: center;
  width: 100%;
}

.line {
  flex-shrink: 0;
  height: 2rem;
  width: 1px;
  background-color: #00000035;
}

.screen {
  display: flex;
  width: 19.5rem;
  align-items: center;
  justify-content: center;
}

.victory {
  display: flex;
  flex-flow: column;
  width: 100%;
}

.info {
  display: flex;
  flex-flow: column;
  gap: 1rem;
  padding: 1rem;
}

.winner {
  text-align: center;
  border-bottom: 1px solid #00000053;
  padding: 1rem;
}

.unfortunate {
  text-align: center;
  text-wrap: balance;
  padding: 1rem;
}
</style>
