<script setup lang="ts">
import { onMounted } from 'vue'
import NimCreate from './features/creation/NimCreate.vue'
import FightStart from './features/fight/FightStart.vue'
import FightScreen from './features/fight/FightScreen.vue'
import Result from './features/result/Result.vue'
import { useNimStore, DayPhase, DayType } from './store/nims'
import TimelineTransition from './features/Timeline/TimelineTransition.vue'
import TimelineDay from './features/Timeline/TimelineDay.vue'
import TimelineNextDay from './features/Timeline/TimelineNextDay.vue'
import NimWinner from './features/winner/NimWinner.vue'

const store = useNimStore()
onMounted(() => store.init())
</script>

<template>
  <main class="timeline-container">
    <div v-for="day in store.days" :key="day.id" v-memo="[day.phase]" class="day">
      <TimelineDay :day="day" />
      <section class="creation" v-if="day.type === DayType.CLASSIC">
        <NimCreate :id="1" />
        <NimCreate :id="2" />
      </section>
      <section class="creation" v-if="day.type === DayType.WINNERSHIP">
        <NimWinner :id="1" />
        <NimWinner :id="2" />
      </section>

      <TimelineTransition>
        <FightStart v-if="day.phase >= DayPhase.READY" :day="day" />
      </TimelineTransition>

      <TimelineTransition>
        <FightScreen v-if="day.phase >= DayPhase.FIGHTING" :day="day" />
      </TimelineTransition>

      <TimelineTransition>
        <Result v-if="day.phase >= DayPhase.RESULT" :day="day" />
      </TimelineTransition>

      <TimelineTransition>
        <TimelineNextDay :day="day" v-if="day.phase >= DayPhase.END" />
      </TimelineTransition>
    </div>
  </main>
</template>

<style>
.timeline-container {
  width: 100vw;
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
}

.creation {
  display: grid;
  grid-template-columns: 20rem 20rem;
  gap: 4rem;
}
</style>
