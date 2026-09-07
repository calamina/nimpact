<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { adjectives, uniqueNamesGenerator } from 'unique-names-generator'
import type { Item } from '@/models/nim.model'

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
    return { name, type: 'ATK', value: getRandomInt(4) }
  }

  const isDef = Math.random() > 0.5
  return {
    name,
    type: isDef ? 'DEF' : 'HP',
    value: isDef ? getRandomInt(4) : getRandomInt(20),
  }
}

const item = ref<Item>(generateItem())
onMounted(() => emit('item', item.value))
</script>

<template>
  <div class="item" v-if="item">
    <p class="low">They possess</p>
    <p>
      {{ item.name }}
      <span class="color-item">({{ item.value }} {{ item.type }})</span>
    </p>
  </div>
</template>

<style scoped>
.item {
  display: flex;
  flex-direction: column;
}
</style>
