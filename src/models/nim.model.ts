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

export interface Item {
  name: string
  type: Stat
  value: number
}

export interface Nim {
  id: string
  name: string
  stats: NimStat[]
  items: Item[]
}

export interface Nimpacter {
  id: string
  name: string
  items: Item[]
  stats: Record<Stat, NimStatFight>
}

export type Stat = 'HP' | 'ATK' | 'DEF'

export enum GameState {
  CREATION = 0,
  READY_TO_FIGHT = 1,
  FIGHTING = 2,
  RESULT = 3,
}
