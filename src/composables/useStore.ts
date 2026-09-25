import { defineStore } from 'pinia'
import { computed, ref, markRaw, shallowRef } from 'vue'
import { Day } from '@/entities/Day'
import { BattleQueue } from '@/entities/BattleQueue'
import type { Battle } from '@/entities/Battle'
import type { Pact } from '@/entities/Pact'

export const useStore = defineStore('store', () => {
  const completedDays = shallowRef<Day[]>([])
  const activeDay = ref<Day | null>(null)
  const queue = ref(new BattleQueue())
  const autofight = ref(false)
  const blitz = ref(false)

  const days = computed(() =>
    activeDay.value ? [...completedDays.value, activeDay.value] : completedDays.value,
  )

  const toggleAutofight = () => (autofight.value = !autofight.value)
  const toggleBlitz = () => (blitz.value = !blitz.value)

  const startNewDay = () => {
    const targetTier = queue.value.getAvailableTier()
    let activeFighters: Pact[] = []

    if (targetTier !== null) {
      const pair = queue.value.get(targetTier)
      if (pair) activeFighters = pair
    }

    const dayId = completedDays.value.length + 1
    activeDay.value = new Day(dayId, targetTier, activeFighters)
  }

  const finalizeDay = async (battle: Battle) => {
    if (!activeDay.value) return
    activeDay.value.finish()
    queue.value.update(battle)
    completedDays.value.push(markRaw(activeDay.value))
    activeDay.value = null
  }

  // const reset = () => {
  //   completedDays.value = []
  //   activeDay.value = null
  //   queue.value = new BattleQueue()
  //   autofight.value = false
  //   blitz.value = false
  //   startNewDay()
  // }

  return {
    days,
    activeDay,
    completedDays,
    winnerQueue: queue,
    startNewDay,
    finalizeDay,
    autofight,
    toggleAutofight,
    blitz,
    toggleBlitz,
  }
})
