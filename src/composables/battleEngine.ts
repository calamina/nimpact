import { ref } from 'vue'
import { useNimStore } from '@/store/nims'
import type { Day } from '@/entities/Day'

export function useBattleEngine(day: Day) {
  const store = useNimStore()
  const battleState = ref<'IDLE' | 'FIGHTING' | 'FINISHED'>('IDLE')
  const TIMER = ref({
    IDLE: store.blitz ? 0 : 300,
    FIGHTING: store.blitz ? 0 : 800,
  })

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

  const runBattle = async () => {
    const [p1, p2] = day.pacts
    if (!p1 || !p2) return

    let round = 0

    if (store.blitz) {
      while (!day.isBattleFinished()) {
        round++
        day.executeRound()

        if (
          round === 3 &&
          p1.stats.HP.current === p1.stats.HP.total &&
          p2.stats.HP.current === p2.stats.HP.total
        ) {
          break
        }
      }

      battleState.value = 'FINISHED'
      store.finalizeBattle()
      return
    }

    while (!day.isBattleFinished()) {
      round++
      battleState.value = 'IDLE'
      await sleep(TIMER.value.IDLE)

      battleState.value = 'FIGHTING'
      await sleep(TIMER.value.FIGHTING)

      day.executeRound()

      if (round % 3 === 0) {
        TIMER.value.IDLE = Math.max(50, TIMER.value.IDLE - 50)
        TIMER.value.FIGHTING = Math.max(200, TIMER.value.FIGHTING - 100)
      }

      if (
        round === 3 &&
        p1.stats.HP.current === p1.stats.HP.total &&
        p2.stats.HP.current === p2.stats.HP.total
      ) {
        break
      }
    }

    battleState.value = 'FINISHED'
    await sleep(500)

    store.finalizeBattle()
  }

  return { battleState, runBattle, TIMER }
}
