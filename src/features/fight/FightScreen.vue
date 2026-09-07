<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useNimStore, type Day } from '@/store/nims'
import NimCard from '../card/NimCard.vue'
import { useBattleEngine } from '@/composables/battleEngine.ts'

const props = defineProps<{
  day: Day
}>()

const store = useNimStore()

const { battleState, runBattle, TIMER } = useBattleEngine(store.currentDay ?? props.day)

const nimpacter1 = computed(() => props.day.nimpacters[0])
const nimpacter2 = computed(() => props.day.nimpacters[1])

const timer = computed(() => TIMER.value.FIGHTING / 1000 + 's')

onMounted(() => runBattle())
</script>

<template>
  <div class="fight">
    <div class="line"></div>
    <div class="screen box" v-if="nimpacter1 && nimpacter2">
      <NimCard :nim="nimpacter1" :key="nimpacter1.id" />
      <div class="window">
        <span
          class="status"
          :class="{ fighting: battleState === 'FIGHTING', finished: battleState === 'FINISHED' }"
          :style="{ '--timer': timer }"
        ></span>
      </div>
      <NimCard :nim="nimpacter2" :key="nimpacter2.id" />
    </div>
  </div>
</template>

<style scoped>
.fight {
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
  display: grid;
  align-items: center;
  justify-content: center;
  grid-template-columns: 1fr 5rem 1fr;
  width: 44rem;
}

.window {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  flex-shrink: 0;
  padding: 1rem;
  width: 100%;
  border-left: 1px solid #00000035;
  border-right: 1px solid #00000035;
}

.status {
  display: block;
  width: 0.75rem;
  height: 0.75rem;
  background-color: slateblue;
  transform: rotate(45deg);

  &.fighting {
    animation: fighting var(--timer) cubic-bezier(0.6, 0, 0.6, 1) infinite;
  }
  &.finished {
    background-color: #00000035;
  }
}

@keyframes fighting {
  0% {
    transform: rotate(45deg);
  }
  100% {
    transform: rotate(405deg);
  }
}
</style>
