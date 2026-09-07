<script setup lang="ts">
import { DayPhase, DayType, useNimStore } from '@/store/nims'
import TimelineTransition from './TimelineTransition.vue'
import TimelineDay from './TimelineDay.vue'
import NimCreate from '../creation/NimCreate.vue'
import NimWinner from '../winner/NimWinner.vue'
import FightStart from '../fight/FightStart.vue'
import FightScreen from '../fight/FightScreen.vue'
import Result from '../result/Result.vue'
import TimelineNextDay from './TimelineNextDay.vue'

const store = useNimStore()
</script>

<template>
  <section class="timeline-view">
    <div v-for="day in store.days" :key="day.id" v-memo="[day.phase]" class="day">
      <TimelineTransition>
        <div class="day">
          <TimelineDay :day="day" />
          <div class="creation" v-if="day.type === DayType.CLASSIC">
            <NimCreate :id="1" />
            <NimCreate :id="2" />
          </div>
          <div class="creation" v-if="day.type === DayType.WINNERSHIP">
            <NimWinner :nim="day.nimpacters[0]" />
            <NimWinner :nim="day.nimpacters[1]" />
          </div>
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
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20svh;
  box-sizing: border-box;
  overflow-y: auto;
}

.day {
  display: flex;
  flex-flow: column;
  align-items: center;
  width: 100%;
}

.creation {
  display: grid;
  grid-template-columns: 20rem 20rem;
  gap: 4rem;
}
</style>
