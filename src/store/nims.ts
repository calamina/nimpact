import { defineStore } from 'pinia'
import { computed, ref, markRaw } from 'vue'
import { resolveBattle } from '@/utils/nim.util'
import { Pact } from '@/entities/Pact'
import { Day } from '@/entities/Day'
import type { Nim } from '@/models/nim.model'

export const useNimStore = defineStore('nim', () => {
  const completedDays = ref<Day[]>([])
  const activeDay = ref<Day | null>(null)

  const days = computed(() => {
    return activeDay.value ? [...completedDays.value, activeDay.value] : completedDays.value
  })

  const autofight = ref(false)
  const blitz = ref(false)
  const winnerQueue = ref<Record<number, Pact[]>>({})

  const init = () => {
    if (!activeDay.value && completedDays.value.length === 0) {
      startNewDay()
    }
  }

  const setAutofight = () => (autofight.value = !autofight.value)
  const setBlitz = () => (blitz.value = !blitz.value)

  const findEligibleWinTier = (): number | null => {
    const tiers = Object.keys(winnerQueue.value)
      .map(Number)
      .sort((a, b) => a - b)

    for (const tier of tiers) {
      if ((winnerQueue.value[tier]?.length ?? 0) >= 2) {
        return tier
      }
    }
    return null
  }

  const startNewDay = () => {
    const targetTier = findEligibleWinTier()
    let activeFighters: Pact[] = []

    if (targetTier !== null) {
      const queue = winnerQueue.value[targetTier]
      const f1 = queue?.[0]
      const f2 = queue?.[1]

      if (f1 && f2) {
        activeFighters = [f1.clone(), f2.clone()]
      }
    }

    activeDay.value = new Day(completedDays.value.length + 1, targetTier, activeFighters)
  }

  const finalizeBattle = async () => {
    if (!activeDay.value || activeDay.value.pacts.length < 2) return

    const [p1, p2] = activeDay.value.pacts
    if (!p1 || !p2) return

    const result = resolveBattle(p1, p2)

    activeDay.value.outcome = result.outcome
    activeDay.value.winner = result.winner
    activeDay.value.loser = result.loser
    activeDay.value.rewards = result.rewards

    activeDay.value.endDay()

    if (result.winner && result.loser) {
      const winner = result.winner
      const loser = result.loser

      removeFromQueue(loser.id)
      removeFromQueue(winner.id)

      const newWinnerTier = winner.wins
      if (!winnerQueue.value[newWinnerTier]) {
        winnerQueue.value[newWinnerTier] = []
      }
      winnerQueue.value[newWinnerTier].push(winner)
    } else {
      removeFromQueue(p1.id)
      removeFromQueue(p2.id)
    }

    completedDays.value.push(markRaw(activeDay.value))
    activeDay.value = null
  }

  const removeFromQueue = (fighterId: string) => {
    for (const tier in winnerQueue.value) {
      winnerQueue.value[tier] = (winnerQueue.value[tier] ?? []).filter((n) => n.id !== fighterId)
    }
  }

  return {
    days,
    activeDay,
    completedDays,
    winnerQueue,
    init,
    startNewDay,
    finalizeBattle,
    autofight,
    setAutofight,
    blitz,
    setBlitz,
  }
})
