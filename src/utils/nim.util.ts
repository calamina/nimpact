import type { Item, Nim, Nimpacter, NimStatBonus, NimStatFight, Stat } from '@/models/nim.model'
import type { Day } from '@/store/nims'

export type BattleOutcome = Day['outcome']

export interface BattleResult {
  outcome: BattleOutcome
  winner: Nimpacter | null
  loser: Nimpacter | null
  rewards: {
    item: Item | null
    stat: NimStatBonus
  } | null
}

export function createNimpacter(nim: Nim): Nimpacter {
  const fightStatsList: NimStatFight[] = nim.stats.map((stat) => {
    const baseVal = 'total' in stat ? stat.total : (stat as { value: number }).value
    const bonus = nim.items.reduce(
      (sum, item) => sum + (item.type === stat.type ? item.value : 0),
      0,
    )
    const total = baseVal + bonus

    return {
      type: stat.type,
      bonus,
      experience: 0,
      base: baseVal,
      total,
      current: total,
      values: stat.values ? [...stat.values] : [],
    }
  })

  const stats = Object.fromEntries(fightStatsList.map((stat) => [stat.type, stat])) as Record<
    Stat,
    NimStatFight
  >

  return {
    id: nim.id,
    name: nim.name,
    items: nim.items.map(mapItem),
    stats,
    wins: 0,
  }
}

export function mapNimpacter(source: Nimpacter): Nimpacter {
  return {
    id: source.id,
    name: source.name,
    items: source.items.map(mapItem),
    stats: {
      HP: mapStat(source.stats.HP),
      ATK: mapStat(source.stats.ATK),
      DEF: mapStat(source.stats.DEF),
    },
    wins: source.wins,
  }
}

function mapItem(item: Item): Item {
  return {
    name: item.name,
    type: item.type,
    value: item.value,
  }
}

function mapStat(stat: NimStatFight): NimStatFight {
  return {
    type: stat.type,
    bonus: stat.bonus,
    experience: stat.experience,
    base: stat.base,
    total: stat.total,
    current: stat.current,
    values: stat.values ? [...stat.values] : [],
  }
}

export function recalculateNimpacter(nimpacter: Nimpacter): Nimpacter {
  const clean = mapNimpacter(nimpacter)
  const statKeys: Stat[] = ['HP', 'ATK', 'DEF']

  statKeys.forEach((statType) => {
    const stat = clean.stats[statType]
    stat.bonus = clean.items.reduce(
      (sum, item) => sum + (item.type === statType ? item.value : 0),
      0,
    )
    stat.total = stat.base + stat.bonus + stat.experience
    stat.current = stat.total
  })

  clean.wins++

  return clean
}

export function resolveBattle(p1Input: Nimpacter, p2Input: Nimpacter): BattleResult {
  const p1 = mapNimpacter(p1Input)
  const p2 = mapNimpacter(p2Input)

  const p1Alive = p1.stats.HP.current > 0
  const p2Alive = p2.stats.HP.current > 0

  if (p1Alive && p2Alive) {
    return { outcome: 'stalemate', winner: null, loser: null, rewards: null }
  }

  if (!p1Alive && !p2Alive) {
    return { outcome: 'unfortunate', winner: null, loser: null, rewards: null }
  }

  const winner = p1Alive ? p1 : p2
  const loser = p1Alive ? p2 : p1

  const stolenItem = loser.items.length > 0 ? loser.items.shift()! : null

  const statTypes: Stat[] = ['ATK', 'DEF', 'HP']
  const selectedType = statTypes[Math.floor(Math.random() * statTypes.length)] ?? 'HP'
  const statBonus: NimStatBonus = {
    type: selectedType,
    value: selectedType === 'HP' ? 5 : 1,
  }

  winner.stats[statBonus.type].experience += statBonus.value
  if (stolenItem) {
    winner.items.push(stolenItem)
  }

  const refreshedWinner = recalculateNimpacter(winner)

  return {
    outcome: 'victory',
    winner: refreshedWinner,
    loser,
    rewards: {
      item: stolenItem ? mapItem(stolenItem) : null,
      stat: statBonus,
    },
  }
}
