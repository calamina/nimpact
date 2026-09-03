// @/composables/useDiceRoller.ts
import { reactive, ref } from 'vue'
import type { NimStat, Stat } from '@/models/nim.model'
import { statList, type StatConfig } from '@/models/create.model'

const CONFIGS: Record<Stat, { dices: number; d: number }> = {
  HP: { dices: 4, d: 9 },
  ATK: { dices: 2, d: 6 },
  DEF: { dices: 2, d: 4 },
}

const rollD = (sides: number) => Math.floor(Math.random() * sides) + 1
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

export function useDiceRoller() {
  const isComplete = ref(false)
  const stats = reactive<Record<Stat, StatConfig>>({
    HP: { name: 'HP', ...CONFIGS.HP, values: [], total: 0, isRolling: false },
    ATK: { name: 'ATK', ...CONFIGS.ATK, values: [], total: 0, isRolling: false },
    DEF: { name: 'DEF', ...CONFIGS.DEF, values: [], total: 0, isRolling: false },
  })

  const rollAllStats = async (): Promise<NimStat[]> => {
    isComplete.value = false

    for (const key of statList) {
      const stat = stats[key]
      stat.isRolling = true
      stat.values = []

      await delay(500)

      for (let i = 0; i < stat.dices; i++) {
        stat.values.push(rollD(stat.d))
        await delay(150)
      }

      const sum = stat.values.reduce((a, b) => a + b, 0)
      stat.total = stat.dices > 1 ? sum - Math.min(...stat.values) : sum
      stat.isRolling = false
    }

    isComplete.value = true

    return Object.values(stats).map((s) => ({
      type: s.name,
      total: s.total,
      values: [...s.values].sort().filter((_, i) => i),
    }))
  }

  return { stats, isComplete, rollAllStats }
}
