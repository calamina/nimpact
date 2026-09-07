import { defineStore } from 'pinia'
import { computed, ref, markRaw } from 'vue'
import type { Item, Nim, Nimpacter, NimStatBonus } from '@/models/nim.model'
import { createNimpacter, mapNimpacter, resolveBattle } from '@/utils/nim.util'

export enum DayPhase {
  CREATING = 0,
  READY = 1,
  FIGHTING = 2,
  RESULT = 3,
  END = 4,
}

export enum DayType {
  CLASSIC = 0,
  WINNERSHIP = 1,
  CHAMPIONSHIP = 2,
}

export interface Day {
  id: number
  nims: Nim[]
  nimpacters: Nimpacter[]
  winner: Nimpacter | null
  loser: Nimpacter | null
  outcome: 'victory' | 'stalemate' | 'unfortunate'
  phase: DayPhase
  type: DayType
  tier: number | null
  rewards: {
    item: Item | null
    stat: NimStatBonus
  } | null
}

export const useNimStore = defineStore('nim', () => {
  const completedDays = ref<Day[]>([])
  const activeDay = ref<Day | null>(null)

  const days = computed(() => {
    return activeDay.value ? [...completedDays.value, activeDay.value] : completedDays.value
  })

  const currentDay = computed(() => activeDay.value)
  const autofight = ref(false)
  const winnerQueue = ref<Record<number, Nimpacter[]>>({})

  const init = () => {
    if (!activeDay.value && completedDays.value.length === 0) {
      startNewDay()
    }
  }

  const setAutofight = () => (autofight.value = !autofight.value)

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
    const isWinnership = targetTier !== null
    let activeFighters: Nimpacter[] = []

    if (isWinnership && targetTier !== null) {
      const queue = winnerQueue.value[targetTier]
      const f1 = queue?.[0]
      const f2 = queue?.[1]

      if (f1 && f2) {
        activeFighters = [mapNimpacter(f1), mapNimpacter(f2)]
      }
    }

    activeDay.value = {
      id: completedDays.value.length + 1,
      nims: [],
      nimpacters: activeFighters,
      winner: null,
      loser: null,
      outcome: 'stalemate',
      phase: isWinnership ? DayPhase.READY : DayPhase.CREATING,
      rewards: null,
      type: isWinnership ? DayType.WINNERSHIP : DayType.CLASSIC,
      tier: targetTier,
    }
  }

  const addNimToDay = (nim: Nim, id: number) => {
    if (!activeDay.value) return

    activeDay.value.nims[id - 1] = nim

    if (activeDay.value.nims.filter(Boolean).length === 2) {
      activeDay.value.phase = DayPhase.READY
    }
  }

  const startFightForDay = () => {
    if (!activeDay.value) return

    if (activeDay.value.nimpacters.length !== 2) {
      activeDay.value.nimpacters = activeDay.value.nims.map(createNimpacter)
    }

    activeDay.value.phase = DayPhase.FIGHTING
  }

  const finalizeBattle = async () => {
    if (!activeDay.value || activeDay.value.nimpacters.length < 2) return

    const [p1, p2] = activeDay.value.nimpacters
    if (!p1 || !p2) return

    const result = resolveBattle(p1, p2)

    activeDay.value.outcome = result.outcome
    activeDay.value.winner = result.winner
    activeDay.value.loser = result.loser
    activeDay.value.rewards = result.rewards
    activeDay.value.phase = DayPhase.END

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
    currentDay,
    winnerQueue,
    init,
    startNewDay,
    addNimToDay,
    startFightForDay,
    finalizeBattle,
    autofight,
    setAutofight,
  }
})
