<script setup lang="ts">
import type { Nimpacter } from '@/models/nim.model'

const { nim } = defineProps<{ nim?: Nimpacter }>()
</script>

<template>
  <div class="nim box" v-if="nim">
    <div>
      <p class="low">Winner</p>
      <p class="color-main">{{ nim.name }}</p>
    </div>
    <div>
      <p class="low">Stats</p>
      <p v-for="stat in nim.stats">
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
      <p v-for="item in nim.items">
        {{ item.name }}
        <span class="color-item">({{ item.value }} {{ item.type }})</span>
      </p>
    </div>
    <div>
      <p class="low">Fight experience</p>
      <template v-for="stat in nim.stats">
        <p v-if="stat.experience" class="color-exp">{{ stat.experience }} {{ stat.type }}</p>
      </template>
    </div>
  </div>
</template>

<style scoped>
.nim {
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
