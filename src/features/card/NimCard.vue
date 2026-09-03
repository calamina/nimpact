<script setup lang="ts">
import type { Nimpacter } from '@/models/nim.model'
import { computed } from 'vue'

const { nim } = defineProps<{
  nim: Nimpacter
}>()

const vanquished = computed(() => nim.stats.HP.current === 0)
</script>

<template>
  <div class="nim" :class="{ vanquished: vanquished }">
    <div class="info">
      <p class="name">{{ nim.name }}</p>
      <p>
        <span class="high">{{ nim.stats.HP.current }}</span>
        <span class="low">/{{ nim.stats.HP.total }}</span>
      </p>
    </div>
    <div
      class="hp"
      :style="{
        '--hp-current': (nim.stats.HP.current / nim.stats.HP.total) * 100 + '%',
      }"
    ></div>
    <div class="info">
      <p>
        <span class="low">{{ 'ATK ' }}</span>
        <span class="high">{{ nim.stats.ATK.total }}</span>
      </p>
      <p>
        <span class="low">{{ 'DEF ' }}</span>
        <span class="high">{{ nim.stats.DEF.total }}</span>
      </p>
    </div>
  </div>
</template>

<style scoped>
.nim {
  width: 100%;
  display: flex;
  flex-flow: column;
  gap: 0.5rem;
  padding: 1rem;
}

.info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2ch;
}

.hp {
  height: 8px;
  border-radius: 4px;
  position: relative;
  overflow: clip;
  background-color: #00000025;

  &:after {
    content: '';
    display: block;
    position: absolute;
    background-color: slateblue;
    height: 100%;
    width: var(--hp-current);
    transition: width 0.125s ease-out;
  }
}

.vanquished {
  .high,
  .low,
  .name {
    color: #000;
    opacity: 0.25;
  }
}
</style>
