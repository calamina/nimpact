<script setup lang="ts">
import type { Pact } from '@/entities/Pact'
import LayoutBlock from './layouts/LayoutBlock.vue'

const { pact, hideName } = defineProps<{ pact?: Pact; hideName?: boolean }>()
</script>

<template>
  <LayoutBlock class="pact" v-if="pact">
    <div v-if="!hideName">
      <p class="low">Winner</p>
      <p class="color-main">{{ pact.name }}</p>
    </div>
    <div>
      <p class="low">Stats</p>
      <p v-for="stat in pact.stats.toArray()">
        <span class="stat">{{ stat.type }}</span>
        <span class="statvalue color-main">{{ stat.total }}</span>
        <span class="low"> [ {{ stat.base }}</span>
        <span class="color-item" v-if="stat.bonus"> + {{ stat.bonus }}</span>
        <span class="color-exp" v-if="stat.experience"> + {{ stat.experience }}</span>
        <span class="low"> ]</span>
      </p>
    </div>
    <div>
      <p class="low">Items</p>
      <p v-for="item in pact.items">
        {{ item.name }}
        <template v-if="item.tier > 1">T{{ item.tier }}&nbsp;</template>
        <span class="color-item">({{ item.value }} {{ item.type }})</span>
      </p>
    </div>
    <div>
      <p class="low">Fight experience</p>
      <template v-for="stat in pact.stats.toArray()">
        <p v-if="stat.experience" class="color-exp">{{ stat.experience }} {{ stat.type }}</p>
      </template>
    </div>
  </LayoutBlock>
</template>

<style scoped>
.pact {
  width: 100%;
  display: flex;
  flex-flow: column;
  gap: 1rem;
  padding: 1rem;
}

.stat {
  display: inline-flex;
  width: 4ch;
}
.statvalue {
  display: inline-flex;
  width: 2ch;
}
</style>
