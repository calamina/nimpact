import type { Stat } from '@/models/nim.model'

export class Item {
  name: string
  type: Stat
  value: number
  tier: number

  constructor(source: Item | { name: string; type: Stat; value: number; tier?: number }) {
    this.name = source.name
    this.type = source.type
    this.value = source.value
    this.tier = source.tier !== undefined ? source.tier : 1
  }

  clone(): Item {
    return new Item({
      name: this.name,
      type: this.type,
      value: this.value,
      tier: this.tier,
    })
  }

  static reforge(item1: Item, item2: Item): Item {
    const nextTier = Math.max(item1.tier, item2.tier) + 1
    const newValue = item1.value + item2.value

    return new Item({
      name: item1.name, // TODO :: newname
      type: item1.type,
      value: newValue,
      tier: nextTier,
    })
  }
}
