<script setup lang="ts">
import { useNimStore } from '@/store/nims'
import TimelineTransition from './TimelineTransition.vue'
import TimelineDay from './TimelineDay.vue'
import NimCreate from '../creation/NimCreate.vue'
import NimWinner from '../winner/NimWinner.vue'
import FightStart from '../fight/FightStart.vue'
import FightScreen from '../fight/FightScreen.vue'
import Result from '../result/Result.vue'
import TimelineNextDay from './TimelineNextDay.vue'
import { DayPhase, DayType } from '@/entities/Day.ts'

const store = useNimStore()
</script>

<template>
  <section class="timeline-view">
    <div v-for="day in store.days" :key="day.id" v-memo="[day.phase]" class="col day">
      <TimelineTransition>
        <TimelineDay :day="day" />
      </TimelineTransition>

      <TimelineTransition>
        <div class="creation" v-if="day.type === DayType.CLASSIC">
          <NimCreate :id="1" />
          <NimCreate :id="2" />
        </div>
        <div class="creation" v-if="day.type === DayType.WINNERSHIP">
          <NimWinner :nim="day.pacts[0]" />
          <NimWinner :nim="day.pacts[1]" />
        </div>
      </TimelineTransition>

      <TimelineTransition :noscroll="true">
        <FightStart v-if="day.phase >= DayPhase.READY" :day="day" />
      </TimelineTransition>

      <TimelineTransition>
        <FightScreen v-if="day.phase >= DayPhase.FIGHTING" :day="day" />
      </TimelineTransition>

      <TimelineTransition>
        <Result v-if="day.phase >= DayPhase.RESULT" :day="day" />
      </TimelineTransition>

      <TimelineTransition :noscroll="true">
        <TimelineNextDay :day="day" v-if="day.phase >= DayPhase.END" />
      </TimelineTransition>
    </div>
  </section>
</template>

<style scoped>
section {
  width: 100%;
  height: calc(100svh - 1rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  gap: 6rem;
  overflow-y: auto;
  border-radius: 8px;
  scrollbar-color: #00000020 transparent;
}

.col {
  display: flex;
  flex-flow: column;
  align-items: center;
  width: 100%;
}

.day {
  gap: 1ch;
}

.creation {
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr;
  gap: 1ch;
}
</style>
