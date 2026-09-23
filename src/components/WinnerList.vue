<script setup lang="ts">
import type { Pact } from '@/entities/Pact'
import NimWinner from '@/features/winner/NimWinner.vue'
import { TIERS, type TierKey } from '@/models/nim.model'
import { useNimStore } from '@/store/nims'
import { computed, ref } from 'vue'

const store = useNimStore()

const sortedTiers = computed(() => {
  return Object.keys(store.winnerQueue.queues)
    .map(Number)
    .filter((tier) => (store.winnerQueue.queues[tier]?.length ?? 0) > 0)
    .sort((a, b) => b - a) as TierKey[]
})

const hasWinners = computed(() => sortedTiers.value.length > 0)

const selectedPact = ref<Pact | null>(null)
const setSelectedNim = (pact: Pact) =>
  (selectedPact.value = selectedPact.value === pact ? null : pact)
</script>

<template>
  <div class="winners" v-if="hasWinners">
    <div v-for="tier in sortedTiers" :key="tier" class="tier">
      <p class="low">{{ TIERS[tier] }} ({{ tier }} wins)</p>
      <template v-for="pact in store.winnerQueue.queues[tier]" :key="pact.id">
        <button @click="setSelectedNim(pact)">
          {{ pact.name }}
        </button>
        <NimWinner
          v-if="selectedPact && selectedPact.id === pact?.id"
          :pact="selectedPact"
          :hideName="true"
        />
      </template>
    </div>
  </div>
</template>

<style scoped>
.winners {
  display: flex;
  flex-flow: column;
  height: fit-content;
  padding: 1rem;
  gap: 1rem;
  width: 100%;
  flex-shrink: 0;
}

.tier-group {
  display: flex;
  flex-flow: column;
  gap: 0.5rem;
}

.tier {
  display: flex;
  flex-flow: column;
  width: 100%;

  button {
    text-align: start;
  }
}
</style>
