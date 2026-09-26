<script setup lang="ts">
import { DayPhase, DayType, type Day } from '@/entities/Day.ts'
import { nextTick, onMounted, useTemplateRef, watch } from 'vue'
import DayHeader from './DayHeader.vue'
import CreateCard from './CreateCard.vue'
import WinnerCard from './WinnerCard.vue'
import BattleStarter from './BattleStarter.vue'
import BattleScreen from './BattleScreen.vue'
import BattleResult from './BattleResult.vue'
import DayNext from './DayNext.vue'

const { day } = defineProps<{ day: Day }>()

const emit = defineEmits<{
  (e: 'phase-changed', targetEl: HTMLElement): void
}>()

const card = useTemplateRef('card')

const phaseChanged = async () => {
  await nextTick()
  const lastChild = card.value?.lastElementChild as HTMLElement | null
  if (lastChild) emit('phase-changed', lastChild)
}

onMounted(() => phaseChanged())
watch(() => day.phase, phaseChanged)
</script>

<template>
  <div class="day" ref="card">
    <DayHeader :day="day" />

    <div class="creation" v-if="day.type === DayType.CLASSIC">
      <CreateCard :id="1" />
      <CreateCard :id="2" />
    </div>
    <div class="creation" v-if="day.type === DayType.WINNERSHIP">
      <WinnerCard :pact="day.pacts[0]" />
      <WinnerCard :pact="day.pacts[1]" />
    </div>

    <BattleStarter v-if="day.phase >= DayPhase.READY" :day="day" />
    <BattleScreen v-if="day.phase >= DayPhase.FIGHTING" :day="day" />
    <BattleResult v-if="day.phase >= DayPhase.RESULT && day.battle" :battle="day.battle" />

    <!-- TODO :: add reforge / stat selection here ! -->
    <DayNext :day="day" v-if="day.phase >= DayPhase.END" />
  </div>
</template>

<style scoped>
.day {
  display: flex;
  flex-flow: column;
  align-items: center;
  width: 100%;
  gap: 1ch;
}

.creation {
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr;
  gap: 1ch;
}
</style>
