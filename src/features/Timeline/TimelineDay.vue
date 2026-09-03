<script setup lang="ts">
import { DayType, type Day } from '@/store/nims'
import { computed } from 'vue'
const { day } = defineProps<{ day: Day }>()

const winnerDay = computed(() => day.type === DayType.WINNERSHIP)
</script>

<template>
  <div class="wrap">
    <p class="day box" :class="{ 'box-high': winnerDay }">
      Day {{ day.id }}<span v-if="winnerDay" class="high"> : Winnership !</span>
    </p>
    <div class="line" :class="{ 'line-high': winnerDay }"></div>
    <div class="lines" :class="{ 'line-high': winnerDay }"></div>
  </div>
</template>

<style scoped>
.wrap {
  display: grid;
  width: 24rem;
  grid-template-rows: auto 2rem 2rem;
  place-items: center;
  margin-top: 6rem;
}

.day {
  padding: 1rem;
  position: sticky;
  top: 2rem;
}

.line {
  height: 100%;
  width: 1px;
  background-color: #00000053;
}

.lines {
  height: 100%;
  width: 100%;
  border: 1px solid #00000053;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  border-bottom: none;
}

.line-high {
  border-color: slateblue;
}
</style>
