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
    if (!day.battle) day.startFight()
    if (!day.battle) return

    if (store.blitz) {
      while (!day.battle.isFinished()) {
        day.battle.executeRound()
      }
    } else {
      while (!day.battle.isFinished()) {
        battleState.value = 'IDLE'
        await sleep(TIMER.value.IDLE)

        battleState.value = 'FIGHTING'
        await sleep(TIMER.value.FIGHTING)

        day.battle.executeRound()

        if (day.battle.round % 3 === 0) {
          TIMER.value.IDLE = Math.max(50, TIMER.value.IDLE - 50)
          TIMER.value.FIGHTING = Math.max(200, TIMER.value.FIGHTING - 100)
        }
      }
    }

    battleState.value = 'FINISHED'
    if (!store.blitz) await sleep(500)
    store.finalizeDay(day.battle)
  }

  return { battleState, runBattle, TIMER }
}
