import { Item } from './Item'
import type { StatType } from './Stat'
import { markRaw } from 'vue'
import { Pact } from './Pact'

export class Winner extends Pact {
  constructor(
    source: Pact,
    rewards: {
      item: Item | null
      stat: { type: StatType; value: number } | null
    },
  ) {
    super(markRaw(source))

    if (rewards.stat) this.stats[rewards.stat.type].experience += rewards.stat.value
    if (rewards.item) this.receiveItem(rewards.item)

    this.updateStats()
    this.stats.HP.current = this.stats.HP.total
  }
}
