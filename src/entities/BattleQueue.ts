import type { Battle } from '@/entities/Battle'
import { Winner } from '@/entities/Winner'
import { Pact } from '@/entities/Pact'

export class BattleQueue {
  queues: Record<number, Pact[]> = {}

  add(fighter: Pact): void {
    const tier = fighter.wins
    if (!this.queues[tier]) this.queues[tier] = []
    this.queues[tier].push(fighter)
  }

  remove(fighterId: string): void {
    for (const tier in this.queues) {
      this.queues[tier] = (this.queues[tier] ?? []).filter((f) => f.id !== fighterId)
    }
  }

  update(battle: Battle): void {
    const { winner, p1, p2, rewards } = battle
    if (!p1 || !p2) return

    this.remove(p1.id)
    this.remove(p2.id)

    if (winner) {
      const nextFighter = new Winner(winner, rewards)
      this.add(nextFighter)
    }
  }

  get(tier: number): [Pact, Pact] | null {
    const queue = this.queues[tier]
    if (queue && queue.length >= 2) {
      const [f1, f2] = queue
      if (f1 && f2) return [f1, f2]
    }
    return null
  }

  getAvailableTier(): number | null {
    const tiers = Object.keys(this.queues)
      .map(Number)
      .sort((a, b) => a - b)

    for (const tier of tiers) {
      if ((this.queues[tier]?.length ?? 0) >= 2) return tier
    }
    return null
  }
}
