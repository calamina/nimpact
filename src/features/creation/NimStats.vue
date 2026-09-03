<script setup lang="ts">
import { onMounted } from 'vue'
import { useDiceRoller } from '@/composables/diceRoller'
import type { StatConfig } from '@/models/create.model'
import type { NimStat } from '@/models/nim.model'

const emit = defineEmits<{
  (e: 'stats', stats: NimStat[]): void
}>()
const { stats, rollAllStats } = useDiceRoller()

onMounted(async () => {
  await new Promise((r) => setTimeout(r, 400))
  const result = await rollAllStats()
  emit('stats', result)
})

const getDroppedIndex = (stat: StatConfig): number => {
  if (stat.isRolling || stat.dices <= 1 || stat.values.length < stat.dices) return -1
  return stat.values.indexOf(Math.min(...stat.values))
}
</script>

<template>
  <div class="stats">
    <p class="low">They seem strong</p>
    <div class="stats-container">
      <div v-for="stat in stats" :key="stat.name" class="stat-row">
        <div class="stat-header">
          <span class="name">{{ stat.name }}</span>
          <span v-if="!stat.isRolling && stat.values.length" class="total">({{ stat.total }})</span>
        </div>

        <div class="dice-group">
          <div
            v-for="i in stat.dices"
            :key="i"
            class="dice box"
            :style="{
              '--d-sides': stat.d,
              '--speed': `${stat.d / 20}s`,
              '--offset': `-${(stat.d - 1) * 1.8}rem`,
            }"
            :class="{
              dropped: getDroppedIndex(stat) === i - 1,
              rolling: stat.isRolling && stat.values[i - 1] === undefined,
            }"
          >
            <div class="face">
              <template v-if="stat.isRolling && stat.values[i - 1] === undefined">
                <p class="value" v-for="n in stat.d" :key="n">{{ n }}</p>
              </template>
              <p class="value" v-else>{{ stat.values[i - 1] ?? '' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stats-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat-row {
  display: flex;
  flex-direction: column;
}

.stat-header {
  display: flex;
  gap: 1ch;
}

.total {
  color: slateblue;
}

.dice-group {
  display: flex;
  gap: 0.5rem;
}

.dice {
  width: 1.8rem;
  height: 1.8rem;
  overflow: hidden;
  display: grid;
  place-items: center;
}

.face {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.value {
  width: 1.8rem;
  height: 1.8rem;
  line-height: 1.8rem;
  text-align: center;
}

.dropped {
  opacity: 0.25;
  position: relative;
  pointer-events: none;
}

.dropped::before {
  content: '';
  position: absolute;
  top: 50%;
  left: -6px;
  right: -6px;
  height: 1px;
  background-color: black;
  opacity: 0.5;
  z-index: 2;
  transform: translateY(-50%) rotate(-45deg);
}

.rolling .face {
  animation: roll var(--speed) linear infinite;
}

@keyframes roll {
  100% {
    transform: translateY(var(--offset));
  }
}
</style>
