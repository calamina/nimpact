<script setup lang="ts">
import { onMounted } from 'vue'
import { useStore } from './store/store.ts'
import TimelineView from './features/Timeline/TimelineView.vue'
import SidebarLayout from './components/layouts/SidebarLayout.vue'
import ModeButtons from './components/ModeButtons.vue'
import DayList from './components/DayList.vue'
import WinnerList from './components/WinnerList.vue'

const store = useStore()
onMounted(() => store.startNewDay())
</script>

<template>
  <main>
    <SidebarLayout>
      <ModeButtons />
      <DayList />
    </SidebarLayout>

    <TimelineView />

    <SidebarLayout>
      <WinnerList />
    </SidebarLayout>
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
