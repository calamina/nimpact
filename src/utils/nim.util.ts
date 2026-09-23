import type { Day } from '@/entities/Day'
import type { Item } from '@/entities/Item'
import type { Pact } from '@/entities/Pact'
import type { NimStatBonus, Stat } from '@/models/nim.model'

export type BattleOutcome = Day['outcome']

export interface BattleResult {
  outcome: BattleOutcome
  winner: Pact | null
  loser: Pact | null
  rewards: {
    item: Item | null
    stat: NimStatBonus
  } | null
}

export function resolveBattle(p1Input: Pact, p2Input: Pact): BattleResult {
  const p1 = p1Input.clone()
  const p2 = p2Input.clone()

  const p1Alive = p1.stats.HP.current > 0
  const p2Alive = p2.stats.HP.current > 0

  if (p1Alive && p2Alive) {
    return { outcome: 'stalemate', winner: null, loser: null, rewards: null }
  }

  if (!p1Alive && !p2Alive) {
    return { outcome: 'unfortunate', winner: null, loser: null, rewards: null }
  }

  const winner = p1Alive ? p1 : p2
  const loser = p1Alive ? p2 : p1

  const stolenItem = loser.stealRandomItem()

  const statTypes: Stat[] = ['ATK', 'DEF', 'HP']
  const selectedType = statTypes[Math.floor(Math.random() * statTypes.length)] ?? 'HP'
  const statBonus: NimStatBonus = {
    type: selectedType,
    value: selectedType === 'HP' ? 5 : 1,
  }

  winner.stats[statBonus.type].experience += statBonus.value

  let rewardedItem: Item | null = null

  // TODO : reforge on action, else choose item ?
  if (stolenItem) {
    rewardedItem = winner.receiveItem(stolenItem)
  }

  winner.recalculate()

  return {
    outcome: 'victory',
    winner,
    loser,
    rewards: {
      item: rewardedItem ? rewardedItem.clone() : null,
      stat: statBonus,
    },
  }
}
