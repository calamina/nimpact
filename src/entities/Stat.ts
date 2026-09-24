import { DICES } from '@/utils/constants'

export type StatType = 'HP' | 'ATK' | 'DEF'

export class Stat {
  type: StatType
  base: number
  bonus: number
  experience: number
  current: number
  values: number[]
  isRolling: boolean = false
  total: number
  dices: number
  d: number

  constructor(source: any = {}) {
    this.type = source.type || 'HP'
    this.base = source.base ?? source.total ?? 0
    this.bonus = source.bonus ?? 0
    this.experience = source.experience ?? 0
    this.values = source.values ? [...source.values] : []

    const config = DICES[this.type] || { dices: 1, d: 6 }
    this.dices = config.dices
    this.d = config.d

    this.total = this.base + this.bonus + this.experience
    this.current = source.current ?? this.total
  }

  recalculate(): void {
    this.total = this.base + this.bonus + this.experience
  }

  clone(): Stat {
    const s = new Stat(this)
    s.isRolling = this.isRolling
    return s
  }

  roll(): void {
    const config = DICES[this.type] || { dices: 1, d: 6 }
    this.values = []
    let sum = 0

    for (let i = 0; i < config.dices; i++) {
      const roll = Math.floor(Math.random() * config.d) + 1
      this.values.push(roll)
      sum += roll
    }

    this.base = config.dices > 1 ? sum - Math.min(...this.values) : sum
    this.recalculate()
    this.current = this.total
  }
}
