<script setup lang="ts">
import { useStore } from '@/store/store.ts'
import NimStats from './NimStats.vue'
import NimPact from './NimPact.vue'
import NimName from './NimName.vue'
import NimItem from './NimItem.vue'
import { computed, ref } from 'vue'
import type { Stats } from '@/entities/Stats.ts'
import { useCreateTransition } from '@/composables/createTransitions.ts'
import BlockLayout from '@/components/layouts/BlockLayout.vue'
import type { Item } from '@/entities/Item.ts'
import { sleep } from '@/utils/utils.ts'
import type { Pact } from '@/entities/Pact.ts'

type CreateState = 'IDLE' | 'ID' | 'STATS' | 'ITEM' | 'DONE'

const { id } = defineProps<{
  id: number
}>()

const store = useStore()
const { onPhaseBeforeEnter, onPhaseEnter, onPhaseLeave, onStepBeforeEnter, onStepEnter } =
  useCreateTransition()

const createState = ref<CreateState>('IDLE')
const draftNim = ref<Partial<Pact>>({})

const isIdDone = computed(() => ['STATS', 'ITEM', 'DONE'].includes(createState.value))
const isStatsDone = computed(() => ['ITEM', 'DONE'].includes(createState.value))
const time = computed(() =>
  store.blitz ? { id: 0, stats: 0, item: 0 } : { id: 700, stats: 250, item: 500 },
)

const onIdentityCreated = async (id: string, name: string) => {
  draftNim.value = { id, name }
  createState.value = 'ID'

  await sleep(time.value.id)
  createState.value = 'STATS'
}

const onStatsCreated = async (stats: Stats) => {
  draftNim.value.stats = stats

  await sleep(time.value.stats)
  createState.value = 'ITEM'
}

const onItemCreated = async (item: Item) => {
  draftNim.value.items = [item]
  createState.value = 'DONE'
  await sleep(time.value.item)

  store.activeDay?.addNim(draftNim.value as Pact, id)
}
</script>

<template>
  <BlockLayout class="create" v-bind="$attrs">
    <Transition
      :css="false"
      mode="out-in"
      @leave="onPhaseLeave"
      @before-enter="onPhaseBeforeEnter"
      @enter="onPhaseEnter"
    >
      <NimPact v-if="createState === 'IDLE'" @id="onIdentityCreated" />

      <div v-else-if="draftNim.name" class="nim">
        <NimName :name="draftNim.name" />

        <Transition :css="false" @before-enter="onStepBeforeEnter" @enter="onStepEnter">
          <NimStats v-if="isIdDone" @stats="onStatsCreated" />
        </Transition>

        <Transition :css="false" @before-enter="onStepBeforeEnter" @enter="onStepEnter">
          <NimItem v-if="isStatsDone" @item="onItemCreated" />
        </Transition>
      </div>
    </Transition>
  </BlockLayout>
</template>

<style scoped>
.create {
  width: 100%;
  position: relative;
  height: fit-content;
  height: 22.4rem;
}

.nim {
  display: flex;
  flex-flow: column;
  gap: 1rem;
  padding: 1rem;
  min-height: 4rem;
}
</style>
