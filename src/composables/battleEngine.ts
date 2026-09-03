import { ref } from 'vue'
import { useNimStore, type Day } from '@/store/nims'
import type { Nimpacter } from '@/models/nim.model'

export function useBattleEngine(day: Day) {
  const store = useNimStore()
  const battleState = ref<'IDLE' | 'FIGHTING' | 'FINISHED'>('IDLE')
  const TIMER = ref({
    IDLE: 300,
    FIGHTING: 800,
  })

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

  const applyDamage = (attacker: Nimpacter, defender: Nimpacter) => {
    const dmg = Math.max(0, attacker.stats.ATK.total - defender.stats.DEF.total)
    defender.stats.HP.current = Math.max(0, defender.stats.HP.current - dmg)
  }

  const runBattle = async () => {
    const [p1, p2] = day.nimpacters
    if (!p1 || !p2) return

    let round = 0
    while (p1.stats.HP.current > 0 && p2.stats.HP.current > 0) {
      round++
      battleState.value = 'IDLE'
      await sleep(TIMER.value.IDLE)

      battleState.value = 'FIGHTING'
      await sleep(TIMER.value.FIGHTING)

      applyDamage(p2, p1)
      applyDamage(p1, p2)

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
