import { Pact } from './Pact'
import { Item } from './Item'
import type { NimStatBonus, Stat } from '@/models/nim.model'

export type BattleOutcome = 'victory' | 'stalemate' | 'unfortunate'

export class Battle {
  p1: Pact
  p2: Pact
  round: number = 0
  outcome: BattleOutcome = 'stalemate'
  winner: Pact | null = null
  loser: Pact | null = null
  rewards: {
    item: Item | null
    stat: NimStatBonus | null
  } = { item: null, stat: null }

  constructor(p1: Pact, p2: Pact) {
    this.p1 = p1.clone()
    this.p2 = p2.clone()
  }

  executeRound(): void {
    if (this.isFinished()) return
    this.round++
    this.p1.applyDamage(this.p2)
    this.p2.applyDamage(this.p1)
  }

  isFinished(): boolean {
    const p1Alive = this.p1.stats.HP.current > 0
    const p2Alive = this.p2.stats.HP.current > 0

    if (!p1Alive || !p2Alive) return true

    if (
      this.round === 3 &&
      this.p1.stats.HP.current === this.p1.stats.HP.total &&
      this.p2.stats.HP.current === this.p2.stats.HP.total
    ) {
      return true
    }

    return false
  }

  finish(): void {
    const p1Alive = this.p1.stats.HP.current > 0
    const p2Alive = this.p2.stats.HP.current > 0

    if (p1Alive && p2Alive) {
      this.outcome = 'stalemate'
      return
    }

    if (!p1Alive && !p2Alive) {
      this.outcome = 'unfortunate'
      return
    }

    this.outcome = 'victory'
    this.winner = p1Alive ? this.p1.clone() : this.p2.clone()
    this.loser = p1Alive ? this.p2.clone() : this.p1.clone()

    const stolenItem = this.loser.stealRandomItem()

    const statTypes: Stat[] = ['ATK', 'DEF', 'HP']
    const selectedType = statTypes[Math.floor(Math.random() * statTypes.length)] ?? 'HP'
    const statBonus: NimStatBonus = {
      type: selectedType,
      value: selectedType === 'HP' ? 5 : 1,
    }

    this.winner.stats[statBonus.type].experience += statBonus.value

    let rewardedItem: Item | null = null
    if (stolenItem) rewardedItem = this.winner.receiveItem(stolenItem)

    this.winner.recalculate()

    this.rewards = {
      item: rewardedItem ? rewardedItem.clone() : null,
      stat: statBonus,
    }
  }
}
