<script setup lang="ts">
import { useStore } from '@/composables/useStore'
import { computed, onMounted, ref } from 'vue'
import type { Day } from '@/entities/Day'
import LayoutBlock from './layouts/LayoutBlock.vue'

const { day } = defineProps<{
  day: Day
}>()

const store = useStore()
const started = ref(false)

function handleStart() {
  started.value = true
  store.activeDay?.startBattle()
}

const resultMessage = computed(() =>
  day.phase === 2 ? 'They are squaring up !' : 'The fight ended ...',
)

onMounted(() => {
  if (store.autofight) handleStart()
})
</script>

<template>
  <LayoutBlock class="fight">
    <div class="box">
      <button v-if="!started" @click="handleStart">Fight</button>
      <p :class="{ low: day.phase !== 2 }" v-else>{{ resultMessage }}</p>
    </div>
  </LayoutBlock>
</template>

<style scoped>
.fight {
  display: flex;
  flex-flow: column;
  align-items: center;
  width: 100%;
}

.box {
  width: 100%;
}

button {
  background-color: #6a5acd44;
}

button,
p {
  position: relative;
  padding: 1rem;
  width: 100%;
  text-align: center;
}
</style>
