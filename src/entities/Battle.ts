import type { Item } from '@/entities/Item'
import type { StatType } from '@/entities/Stat'
import { FIGHT, LEVELUP } from '@/utils/constants'
import { Pact } from './Pact'

type BattleOutcome = 'victory' | 'stalemate' | 'unfortunate'
type BattleRewards = {
  item: Item | null
  stat: { type: StatType; value: number } | null
}

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

  getLivePacts(): boolean[] {
    return [this.p1.stats.HP.current > 0, this.p2.stats.HP.current > 0]
  }

  setOutcome(): BattleOutcome {
    const [p1Alive, p2Alive] = this.getLivePacts()
    if (p1Alive && p2Alive) return (this.outcome = 'stalemate')
    if (!p1Alive && !p2Alive) return (this.outcome = 'unfortunate')
    return (this.outcome = 'victory')
  }

  setWinnerandLoser() {
    const [p1Alive] = this.getLivePacts()
    this.winner = p1Alive ? this.p1 : this.p2
    this.loser = p1Alive ? this.p2 : this.p1
  }

  setRewards(): BattleRewards {
    const stolenItem = this.loser?.stealRandomItem() ?? null
    const statTypes: StatType[] = ['ATK', 'DEF', 'HP']
    const selectedType = statTypes[Math.floor(Math.random() * statTypes.length)] ?? 'HP'

    this.rewards = {
      item: stolenItem,
      stat: {
        type: selectedType,
        value: selectedType === 'HP' ? LEVELUP.HP_VALUE : LEVELUP.DEFAULT_VALUE,
      },
    }
    return this.rewards
  }

  isFinished(): boolean {
    const [p1Alive, p2Alive] = this.getLivePacts()
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

  executeRound(): void {
    if (this.isFinished()) return

    this.round++
    this.p1.applyDamage(this.p2)
    this.p2.applyDamage(this.p1)
  }

  finish(): void {
    if (this.outcome !== 'stalemate' || this.winner !== null) return
    this.setOutcome()
    this.setWinnerandLoser()
    this.setRewards()
  }
}
