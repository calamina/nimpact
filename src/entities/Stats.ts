import { Stat, type StatType } from './Stat'

export class Stats {
  HP: Stat
  ATK: Stat
  DEF: Stat

  constructor(source?: Partial<Record<StatType, Partial<Stat> | Stat>> | Stats) {
    const raw = source instanceof Stats ? source : (source ?? {})
    this.HP = new Stat(raw.HP ?? { type: 'HP' })
    this.ATK = new Stat(raw.ATK ?? { type: 'ATK' })
    this.DEF = new Stat(raw.DEF ?? { type: 'DEF' })
  }

  toArray(): Stat[] {
    return [this.HP, this.ATK, this.DEF]
  }

  rollAll(): void {
    this.HP.roll()
    this.ATK.roll()
    this.DEF.roll()
  }
}
