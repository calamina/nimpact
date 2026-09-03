import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
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
  rewards: {
    item: Item | null
    stat: NimStatBonus
  } | null
}

export const useNimStore = defineStore('nim', () => {
  const days = ref<Day[]>([])
  const currentDay = computed(() => days.value[days.value.length - 1])

  const winnerQueue = ref<Nimpacter[]>([])

  const init = () => {
    if (days.value.length === 0) startNewDay()
  }

  const startNewDay = () => {
    const isWinnership = winnerQueue.value.length >= 2
    let activeFighters: Nimpacter[] = []

    if (isWinnership) {
      const [f1, f2] = winnerQueue.value.splice(0, 2)
      if (f1 && f2) {
        activeFighters = [mapNimpacter(f1), mapNimpacter(f2)]
      }
    }

    days.value.push({
      id: days.value.length + 1,
      nims: [],
      nimpacters: activeFighters,
      winner: null,
      loser: null,
      outcome: 'stalemate',
      phase: isWinnership ? DayPhase.READY : DayPhase.CREATING,
      rewards: null,
      type: isWinnership ? DayType.WINNERSHIP : DayType.CLASSIC,
    })
  }

  const addNimToDay = (nim: Nim, id: number) => {
    const day = currentDay.value
    if (!day) return

    day.nims[id - 1] = nim

    if (day.nims.filter(Boolean).length === 2) {
      day.phase = DayPhase.READY
    }
  }

  const startFightForDay = () => {
    const day = currentDay.value
    if (!day) return

    if (day.nimpacters.length !== 2) {
      day.nimpacters = day.nims.map(createNimpacter)
    }

    day.phase = DayPhase.FIGHTING
  }

  const finalizeBattle = async () => {
    const day = currentDay.value
    if (!day || day.nimpacters.length < 2) return

    const [p1, p2] = day.nimpacters
    if (!p1 || !p2) return

    const result = resolveBattle(p1, p2)

    day.outcome = result.outcome
    day.winner = result.winner
    day.loser = result.loser
    day.rewards = result.rewards
    day.phase = DayPhase.RESULT

    if (result.winner) {
      winnerQueue.value.push(result.winner)
    }

    await new Promise((r) => setTimeout(r, 1000))
    day.phase = DayPhase.END
  }

  return {
    days,
    currentDay,
    winnerQueue,
    init,
    startNewDay,
    addNimToDay,
    startFightForDay,
    finalizeBattle,
  }
})
