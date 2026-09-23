import type { Nim, NimStatBonus } from '@/models/nim.model'
import { Pact } from './Pact'
import type { Item } from './Item'

export enum DayPhase {
  CREATING = 0,
  READY = 1,
  FIGHTING = 2,
  RESULT = 3,
  END = 4,
}

export enum DayType {
  CLASSIC = 0,
  WINNERSHIP = 1,
}

export class Day {
  id: number
  nims: Nim[]
  pacts: Pact[]
  winner: Pact | null
  loser: Pact | null
  outcome: 'victory' | 'stalemate' | 'unfortunate'
  phase: DayPhase
  type: DayType
  tier: number | null
  rewards: {
    item: Item | null
    stat: NimStatBonus
  } | null

  constructor(id: number, tier: number | null, activeFighters: Pact[] = []) {
    this.id = id
    this.nims = []
    this.pacts = activeFighters
    this.winner = null
    this.loser = null
    this.outcome = 'stalemate'
    this.phase = activeFighters.length > 0 ? DayPhase.READY : DayPhase.CREATING
    this.type = activeFighters.length > 0 ? DayType.WINNERSHIP : DayType.CLASSIC
    this.tier = tier
    this.rewards = null
  }

  addNim(nim: Nim, id: number): void {
    this.nims[id - 1] = nim
    if (this.nims.filter(Boolean).length === 2) {
      this.phase = DayPhase.READY
    }
  }

  startFight(): void {
    if (this.pacts.length !== 2) {
      this.pacts = this.nims.map((nim) => new Pact(nim))
    }
    this.phase = DayPhase.FIGHTING
  }

  endDay(): void {
    this.phase = DayPhase.END
  }

  executeRound(): void {
    const [p1, p2] = this.pacts
    if (!p1 || !p2) return
    p1.applyDamage(p2)
    p2.applyDamage(p1)
  }

  isBattleFinished(): boolean {
    const [p1, p2] = this.pacts
    if (!p1 || !p2) return true
    return p1.stats.HP.current <= 0 || p2.stats.HP.current <= 0
  }
}
