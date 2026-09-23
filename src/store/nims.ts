import { defineStore } from 'pinia'
import { computed, ref, markRaw } from 'vue'
import { Pact } from '@/entities/Pact'
import { Day } from '@/entities/Day'
import { Battle } from '@/entities/Battle'
import { BattleQueue } from '@/entities/BattleQueue'

export const useNimStore = defineStore('nim', () => {
  const completedDays = ref<Day[]>([])
  const activeDay = ref<Day | null>(null)
  const queue = ref(new BattleQueue())
  const autofight = ref(false)
  const blitz = ref(false)

  const days = computed(() =>
    activeDay.value ? [...completedDays.value, activeDay.value] : completedDays.value,
  )

  const init = () => {
    if (!activeDay.value && completedDays.value.length === 0) startNewDay()
  }

  const setAutofight = () => (autofight.value = !autofight.value)
  const setBlitz = () => (blitz.value = !blitz.value)

  const startNewDay = () => {
    const targetTier = queue.value.getAvailableTier()
    let activeFighters: Pact[] = []

    if (targetTier !== null) {
      const pair = queue.value.get(targetTier)
      if (pair) activeFighters = pair
    }

    activeDay.value = new Day(completedDays.value.length + 1, targetTier, activeFighters)
  }

  const finalizeDay = async (battle: Battle) => {
    if (!activeDay.value) return

    activeDay.value.concludeBattle()
    queue.value.update(battle.winner, activeDay.value.pacts)

    // Maybe add timer to delay next day button
    activeDay.value.endDay()
    completedDays.value.push(markRaw(activeDay.value))
    activeDay.value = null
  }

  return {
    days,
    activeDay,
    completedDays,
    winnerQueue: queue,
    init,
    startNewDay,
    finalizeDay,
    autofight,
    setAutofight,
    blitz,
    setBlitz,
  }
})
