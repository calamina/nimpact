<script setup lang="ts">
import { type Day } from '@/store/nims'
const { day } = defineProps<{ day: Day }>()

const TIERS = {
  1: 'Winners',
  2: 'Champions',
  3: 'Heroes',
  4: 'Legends',
  5: 'Demi-gods',
  6: '???',
} as const

type TierKey = keyof typeof TIERS
</script>

<template>
  <div class="wrap">
    <h2 :id="'day' + day.id" class="day box" :class="{ 'box-color-main': day.tier }">
      Day {{ day.id }}
      <span v-if="day.tier" class="color-main">{{ TIERS[day.tier as TierKey] }}'s fight !</span>
    </h2>
    <div class="line"></div>
    <div class="lines"></div>
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
  display: flex;
  flex-flow: column;
  align-items: center;
  scroll-margin-top: 2rem;
}

.line {
  height: 100%;
  width: 1px;
  background-color: #00000035;
}

.lines {
  height: 100%;
  width: 100%;
  border: 1px solid #00000035;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  border-bottom: none;
}

.line-high {
  border-color: slateblue;
}
</style>
