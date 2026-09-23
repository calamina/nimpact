import type { Nim } from '@/models/nim.model'
import { Pact } from './Pact'
import { Battle } from './Battle'

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
  phase: DayPhase
  type: DayType
  tier: number | null
  battle: Battle | null = null

  constructor(id: number, tier: number | null, activeFighters: Pact[] = []) {
    this.id = id
    this.nims = []
    this.pacts = activeFighters
    this.phase = activeFighters.length > 0 ? DayPhase.READY : DayPhase.CREATING
    this.type = activeFighters.length > 0 ? DayType.WINNERSHIP : DayType.CLASSIC
    this.tier = tier
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

    const [p1, p2] = this.pacts
    if (p1 && p2) this.battle = new Battle(p1, p2)

    this.phase = DayPhase.FIGHTING
  }

  endDay(): void {
    this.phase = DayPhase.END
  }

  isBattleFinished(): boolean {
    return this.battle ? this.battle.isFinished() : true
  }

  concludeBattle(): void {
    if (!this.battle) return
    this.battle.finish()
    this.phase = DayPhase.RESULT
  }
}
