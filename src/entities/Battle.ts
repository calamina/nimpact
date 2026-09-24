import { Pact } from './Pact'
import { Item } from './Item'
import { FIGHT, LEVELUP } from '@/utils/constants'
import type { StatType } from './Stat'

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
    stat: { type: StatType; value: number } | null
  } = { item: null, stat: null }

  constructor(p1: Pact, p2: Pact) {
    this.p1 = p1
    this.p2 = p2
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
      this.round >= FIGHT.MAX_IDLE_ROUNDS &&
      this.p1.stats.HP.current === this.p1.stats.HP.total &&
      this.p2.stats.HP.current === this.p2.stats.HP.total
    ) {
      return true
    }

    return false
  }

  finish(): void {
    if (this.outcome !== 'stalemate' || this.winner !== null) return

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
    this.winner = p1Alive ? this.p1 : this.p2
    this.loser = p1Alive ? this.p2 : this.p1

    const stolenItem = this.loser.stealRandomItem()

    const statTypes: StatType[] = ['ATK', 'DEF', 'HP']
    const selectedType = statTypes[Math.floor(Math.random() * statTypes.length)] ?? 'HP'
    const statBonus = {
      type: selectedType,
      value: selectedType === 'HP' ? LEVELUP.HP_VALUE : LEVELUP.DEFAULT_VALUE,
    }

    this.winner.stats[statBonus.type].experience += statBonus.value

    let rewardedItem: Item | null = null
    if (stolenItem) rewardedItem = this.winner.receiveItem(stolenItem)

    this.winner.recalculate()

    this.rewards = {
      item: rewardedItem ? rewardedItem : null,
      stat: statBonus,
    }
  }
}
