<script setup lang="ts">
import { useNimStore, type Day } from '@/store/nims'
import { computed, ref } from 'vue'

const { day } = defineProps<{
  day: Day
}>()

const store = useNimStore()
const started = ref(false)

function handleStart() {
  started.value = true
  store.startFightForDay()
}

const resultMessage = computed(() =>
  day.phase === 2 ? 'They are squaring up !' : 'The fight ended ...',
)
</script>

<template>
  <div class="fight">
    <div class="lines"></div>
    <div class="box">
      <button v-if="!started" @click="handleStart">Fight</button>
      <p :class="{ low: day.phase !== 2 }" v-else>{{ resultMessage }}</p>
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

.lines {
  height: 2rem;
  border-left: 1px solid #00000053;
  border-right: 1px solid #00000053;
  width: 24rem;
  flex-shrink: 0;
}

button,
p {
  position: relative;
  padding: 1rem;
  width: 40rem;
  text-align: center;
}
</style>
