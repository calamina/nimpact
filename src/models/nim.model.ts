import type { Item } from '@/entities/Item'

export interface NimStat {
  type: Stat
  total: number
  values: number[]
}

export interface NimStatFight extends NimStat {
  base: number
  bonus: number
  experience: number
  current: number
}

export interface NimStatBonus {
  type: Stat
  value: number
}

export interface Nim {
  id: string
  name: string
  stats: NimStat[]
  items: Item[]
}

export type Stat = 'HP' | 'ATK' | 'DEF'

export enum GameState {
  CREATION = 0,
  READY_TO_FIGHT = 1,
  FIGHTING = 2,
  RESULT = 3,
}

export const TIERS = {
  1: 'Pacten',
  2: 'Qhand',
  3: 'Jjaar',
  4: 'Shand',
  5: 'Strahl',
  6: 'Abstrahl',
  7: 'Myrie',
  8: 'Anda-Myrie',
} as const

export type TierKey = keyof typeof TIERS
