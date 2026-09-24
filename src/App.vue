<script setup lang="ts">
import { onMounted } from 'vue'
import { useStore } from './composables/useStore.ts'

const store = useStore()
onMounted(() => store.startNewDay())
</script>

<template>
  <main>
    <LayoutSidebar>
      <ModeButtons />
      <DayIndex />
    </LayoutSidebar>

    <DayList />

    <LayoutSidebar>
      <WinnerList />
    </LayoutSidebar>
  </main>
</template>

<style scoped>
main {
  display: grid;
  grid-template-columns: 20% 60% 20%;
  height: 100svh;
  width: 100vw;
}
</style>
