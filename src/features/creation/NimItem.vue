<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { adjectives, uniqueNamesGenerator } from 'unique-names-generator'
import { Item } from '@/entities/Item'

const emit = defineEmits<{
  (e: 'item', item: Item): void
}>()

const WEAPONS = ['sword', 'bow', 'dagger', 'axe', 'mace', 'knife', 'spear']
const ARMORS = ['mail', 'helm', 'shield', 'cuirass', 'brigandine', 'breastplate', 'buckler']

const getRandomInt = (max: number) => Math.floor(Math.random() * max) + 1

const generateItem = (): Item => {
  const isWeapon = Math.random() > 0.5
  const dictionary = isWeapon ? WEAPONS : ARMORS

  const name = uniqueNamesGenerator({
    dictionaries: [adjectives, dictionary],
    separator: ' ',
    style: 'capital',
  })

  if (isWeapon) {
    return new Item({ name, type: 'ATK', value: getRandomInt(4), tier: 1 })
  }

  const isDef = Math.random() > 0.5
  return new Item({
    name,
    type: isDef ? 'DEF' : 'HP',
    value: isDef ? getRandomInt(4) : getRandomInt(20),
    tier: 1,
  })
}

const item = ref<Item>(generateItem())
onMounted(() => emit('item', item.value))
</script>

<template>
  <div class="item" v-if="item">
    <p class="low">They possess</p>
    <div class="info">
      <p class="name">{{ item.name }}</p>
      <span class="color-item value">({{ item.value }} {{ item.type }})</span>
    </div>
  </div>
</template>

<style scoped>
.info {
  display: flex;
  gap: 1ch;
}

.name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.value {
  flex-shrink: 0;
}

.item {
  display: flex;
  flex-direction: column;
}
</style>
