export type CreateState = 'IDLE' | 'ID' | 'STATS' | 'ITEM' | 'DONE'

export interface StatConfig {
  name: Stat
  dices: number
  d: number
  values: number[]
  total: number
  isRolling: boolean
}

export interface StatData {
  config: StatConfig
  state: DiceState
  values: number[]
  total: number
}

export const diceStateList = ['UNSET', 'ROLLING', 'SET'] as const
export type DiceState = (typeof diceStateList)[number]

export const statList = ['HP', 'ATK', 'DEF'] as const
export type Stat = (typeof statList)[number]
