import { ref } from 'vue'
import type { NimStat, Stat } from '@/models/nim.model'
import { statList, type StatConfig } from '@/models/create.model'
import { useNimStore } from '@/store/nims'

const CONFIGS: Record<Stat, { dices: number; d: number }> = {
  HP: { dices: 4, d: 9 },
  ATK: { dices: 2, d: 6 },
  DEF: { dices: 2, d: 4 },
}

const rollD = (sides: number) => Math.floor(Math.random() * sides) + 1
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

export function useDiceRoller() {
  const store = useNimStore()
  const isComplete = ref(false)

  const stats = ref<Record<Stat, StatConfig>>({
    HP: { name: 'HP', ...CONFIGS.HP, values: [], total: 0, isRolling: false },
    ATK: { name: 'ATK', ...CONFIGS.ATK, values: [], total: 0, isRolling: false },
    DEF: { name: 'DEF', ...CONFIGS.DEF, values: [], total: 0, isRolling: false },
  })

  const computeStat = (stat: StatConfig) => {
    stat.values = []
    let sum = 0

    for (let i = 0; i < stat.dices; i++) stat.values.push(rollD(stat.d))
    for (const val of stat.values) sum += val

    stat.total = stat.dices > 1 ? sum - Math.min(...stat.values) : sum
    stat.isRolling = false
  }

  const rollAllStats = async (): Promise<NimStat[]> => {
    isComplete.value = false

    if (store.blitz) {
      for (const key of statList) {
        computeStat(stats.value[key])
      }
    } else {
      for (const key of statList) {
        const stat = stats.value[key]
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
    }

    isComplete.value = true

    return Object.values(stats.value).map((s) => ({
      type: s.name,
      total: s.total,
      values: [...s.values].sort().filter((_, i) => i),
    }))
  }

  return { stats, isComplete, rollAllStats }
}
