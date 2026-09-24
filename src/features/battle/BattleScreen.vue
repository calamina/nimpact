<script setup lang="ts">
import { onMounted, computed } from 'vue'
import NimCard from '../card/NimCard.vue'
import BlockLayout from '@/components/layouts/BlockLayout.vue'
import type { Day } from '@/entities/Day.ts'
import { useBattleEngine } from '@/composables/BattleEngine.ts'

const props = defineProps<{
  day: Day
}>()

const { battleState, runBattle, TIMER } = useBattleEngine(props.day)

const firstPact = computed(() => props.day.battle?.p1)
const secondPact = computed(() => props.day.battle?.p2)

const timer = computed(() => TIMER.value.FIGHTING / 1000 + 's')

onMounted(() => runBattle())
</script>

<template>
  <div class="fight">
    <div class="screen" v-if="firstPact && secondPact">
      <NimCard :pact="firstPact" :key="firstPact.id" />
      <BlockLayout class="window">
        <span
          class="status"
          :class="{ fighting: battleState === 'FIGHTING', finished: battleState === 'FINISHED' }"
          :style="{ '--timer': timer }"
        ></span>
      </BlockLayout>
      <NimCard :pact="secondPact" :key="secondPact.id" />
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

.screen {
  display: grid;
  align-items: center;
  justify-content: center;
  grid-template-columns: 1fr 5rem 1fr;
  width: 100%;
}

.window {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  flex-shrink: 0;
  padding: 1rem;
  width: 100%;
  background-color: #00000014;
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
    background-color: #00000050;
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
