<script setup lang="ts">
import { useNimStore } from '@/store/nims'
import { computed } from 'vue'

const { id } = defineProps<{ id: number }>()
const store = useNimStore()
const nim = computed(() => store.currentDay?.nimpacters[id - 1])
</script>

<template>
  <div class="nim box box-high" v-if="nim">
    <div>
      <p class="high">Winner</p>
      <p>{{ nim.name }}</p>
    </div>
    <div>
      <p class="low">Stats</p>
      <p v-for="stat in nim.stats">
        <span class="stat">{{ stat.type }}</span> : {{ stat.base }}
        <span class="high" v-if="stat.bonus">+ {{ stat.bonus }}</span>
        <span class="alt" v-if="stat.experience"> + {{ stat.experience }}</span>
      </p>
    </div>
    <div>
      <p class="low">Items</p>
      <p v-for="item in nim.items">
        {{ item.name }} : <span class="high">{{ item.value }} {{ item.type }}</span>
      </p>
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
  width: 3ch;
}
</style>
