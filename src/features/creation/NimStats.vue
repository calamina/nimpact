<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useDiceRoller } from '@/composables/diceRoller'
import { useStore } from '@/store/store'
import type { Stat } from '@/entities/Stat'
import type { Stats } from '@/entities/Stats'

const emit = defineEmits<{
  (e: 'stats', stats: Stats): void
}>()
const { stats, rollAllStats } = useDiceRoller()

const store = useStore()
const time = computed(() => (store.blitz ? 0 : 400))

onMounted(async () => {
  await new Promise((r) => setTimeout(r, time.value))
  const result = await rollAllStats()
  emit('stats', result)
})

const getDroppedIndex = (stat: Stat): number => {
  if (stat.isRolling || stat.dices <= 1 || stat.values.length < stat.dices) return -1
  return stat.values.indexOf(Math.min(...stat.values))
}
</script>

<template>
  <div class="stats">
    <p class="low">They seem strong</p>
    <div class="stats-container">
      <div v-for="stat in stats.toArray()" :key="stat.type" class="stat-row">
        <div class="stat-header">
          <span class="name">{{ stat.type }}</span>
          <span v-if="!stat.isRolling && stat.values.length" class="total">({{ stat.total }})</span>
        </div>

        <div class="dice-group">
          <div
            v-for="i in stat.dices"
            :key="i"
            class="dice"
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
  align-items: center;
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
  border: 1px solid #00000035;
  background-color: #0000000a;
  border-radius: 4px;
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
