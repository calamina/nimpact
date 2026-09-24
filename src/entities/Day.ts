import { Pact } from './Pact'
import { Battle } from './Battle'

export const DayPhase = {
  CREATING: 0,
  READY: 1,
  FIGHTING: 2,
  RESULT: 3,
  END: 4,
} as const
export type DayPhase = (typeof DayPhase)[keyof typeof DayPhase]

export const DayType = {
  CLASSIC: 0,
  WINNERSHIP: 1,
} as const
export type DayType = (typeof DayType)[keyof typeof DayType]

export class Day {
  id: number
  nims: Pact[]
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

  addNim(nim: Pact, id: number): void {
    this.nims[id - 1] = nim
    if (this.nims.filter(Boolean).length === 2) {
      this.phase = DayPhase.READY
    }
  }

  startBattle(): void {
    if (this.pacts.length !== 2) {
      if (this.nims.length < 2) return
      this.pacts = this.nims.map((nim) => new Pact(nim))
    }

    const [p1, p2] = this.pacts
    if (p1 && p2) this.battle = new Battle(p1, p2)

    this.phase = DayPhase.FIGHTING
  }

  isBattleFinished(): boolean {
    return this.battle ? this.battle.isFinished() : true
  }

  finish(): void {
    if (!this.battle) return
    this.battle.finish()
    this.phase = DayPhase.RESULT
    // TODO :: add timer if needed, check blitz for the blitz bug
    this.phase = DayPhase.END
  }
}
