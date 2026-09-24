import { Item } from '@/entities/Item'
import { Stats } from '@/entities/Stats'
import { FIGHT } from '@/utils/constants'
import type { StatType } from '@/entities/Stat'

export class Pact {
  id: string
  name: string
  items: Item[]
  stats: Stats
  wins: number

  constructor(source: Pact) {
    this.id = source.id
    this.name = source.name
    this.wins = source.wins ?? 0
    this.items = source.items.map((item) => new Item(item))
    this.stats = new Stats(source.stats)
  }

  stealRandomItem(): Item | null {
    if (Math.random() > 2 / 3) return null

    const randomIndex = Math.floor(Math.random() * this.items.length)
    const [stolenItem] = this.items.splice(randomIndex, 1)
    return stolenItem ?? null
  }

  receiveItem(incomingItem: Item): Item {
    let currentItem = incomingItem

    while (true) {
      const existingIndex = this.items.findIndex((item) => item.type === currentItem.type)
      if (existingIndex !== -1) {
        const [existingItem] = this.items.splice(existingIndex, 1)
        if (existingItem) {
          currentItem = Item.reforge(existingItem, currentItem)
        }
      } else {
        break
      }
    }

    this.items.push(currentItem)
    return currentItem
  }

  updateStats(): void {
    const statKeys: StatType[] = ['HP', 'ATK', 'DEF']

    statKeys.forEach((key) => {
      const stat = this.stats[key]
      stat.bonus = this.items.reduce((sum, item) => sum + (item.type === key ? item.value : 0), 0)
      stat.recalculate()
    })

    this.wins++
  }

  applyDamage(attacker: Pact): void {
    const atk = attacker.stats.ATK.total
    const def = this.stats.DEF.total

    if (atk <= def) return

    const rawDmg = atk * (FIGHT.MITIGATION_K / (def + FIGHT.MITIGATION_K))
    const dmg = Math.round(rawDmg)

    this.stats.HP.current = Math.max(0, this.stats.HP.current - dmg)
  }
}
