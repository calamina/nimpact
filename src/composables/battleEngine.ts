import { ref } from 'vue'
import { useStore } from '@/store/store'
import type { Day } from '@/entities/Day'
import { sleep } from '@/utils/utils'

export function useBattleEngine(day: Day) {
  const store = useStore()
  const battleState = ref<'IDLE' | 'FIGHTING' | 'FINISHED'>('IDLE')

  const TIMER = ref({
    IDLE: store.blitz ? 0 : 300,
    FIGHTING: store.blitz ? 0 : 800,
  })

  const runBattle = async () => {
    if (day.battle?.isFinished()) return
    if (!day.battle) day.startBattle()
    if (!day.battle) return

    if (store.blitz) {
      let maxRounds = 0
      while (!day.battle.isFinished()) {
        day.battle.executeRound()
        maxRounds++
        if (maxRounds >= 25) break
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

    await sleep(TIMER.value.IDLE)
    battleState.value = 'FINISHED'
    store.finalizeDay(day.battle)
  }

  return { battleState, runBattle, TIMER }
}
