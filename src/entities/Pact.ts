import type { Nim, NimStatFight, Stat } from '@/models/nim.model'
import { Item } from './Item'

export class Pact {
  id: string
  name: string
  items: Item[]
  stats: Record<Stat, NimStatFight>
  wins: number

  constructor(source: Nim | Pact) {
    this.id = source.id
    this.name = source.name
    this.items = source.items.map((item) => new Item(item))
    this.wins = 'wins' in source ? source.wins : 0

    if ('stats' in source && !Array.isArray(source.stats)) {
      this.stats = {
        HP: { ...source.stats.HP, values: [...source.stats.HP.values] },
        ATK: { ...source.stats.ATK, values: [...source.stats.ATK.values] },
        DEF: { ...source.stats.DEF, values: [...source.stats.DEF.values] },
      }
    } else if ('stats' in source && Array.isArray(source.stats)) {
      const fightStatsList: NimStatFight[] = source.stats.map((stat) => {
        const baseVal = 'total' in stat ? stat.total : (stat as { value: number }).value
        const bonus = this.items.reduce(
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

      this.stats = Object.fromEntries(fightStatsList.map((stat) => [stat.type, stat])) as Record<
        Stat,
        NimStatFight
      >
    } else {
      this.stats = { HP: {} as any, ATK: {} as any, DEF: {} as any }
    }
  }

  clone(): Pact {
    return new Pact(this)
  }

  stealRandomItem(): Item | null {
    if (this.items.length === 0) return null
    const randomIndex = Math.floor(Math.random() * this.items.length)
    const [stolenItem] = this.items.splice(randomIndex, 1)
    return stolenItem ?? null
  }

  receiveItem(incomingItem: Item): Item {
    const existingIndex = this.items.findIndex((item) => item.type === incomingItem.type)

    if (existingIndex !== -1) {
      const existingItem = this.items[existingIndex]!
      const upgraded = Item.reforge(existingItem, incomingItem)
      this.items[existingIndex] = upgraded
      return upgraded
    } else {
      this.items.push(incomingItem)
      return incomingItem
    }
  }

  recalculate(): void {
    const statKeys: Stat[] = ['HP', 'ATK', 'DEF']

    statKeys.forEach((statType) => {
      const stat = this.stats[statType]
      stat.bonus = this.items.reduce(
        (sum, item) => sum + (item.type === statType ? item.value : 0),
        0,
      )
      stat.total = stat.base + stat.bonus + stat.experience
      stat.current = stat.total
    })

    this.wins++
  }

  applyDamage(attacker: Pact): void {
    const K = 20
    const atk = attacker.stats.ATK.total
    const def = this.stats.DEF.total

    if (atk <= def) return

    const rawDmg = atk * (K / (def + K))
    const dmg = Math.round(rawDmg)

    this.stats.HP.current = Math.max(0, this.stats.HP.current - dmg)
  }
}
