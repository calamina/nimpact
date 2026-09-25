<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStore } from '@/composables/useStore'
import { useCreateTransition } from '@/composables/useCreate.ts'
import { sleep } from '@/utils/utils'
import type { Stats } from '@/entities/Stats.ts'
import type { Item } from '@/entities/Item.ts'
import type { Pact } from '@/entities/Pact.ts'

type CreateState = 'IDLE' | 'ID' | 'STATS' | 'ITEM' | 'DONE'

const { id } = defineProps<{
  id: number
}>()

const store = useStore()
const { onPhaseBeforeEnter, onPhaseEnter, onPhaseLeave, onStepBeforeEnter, onStepEnter } =
  useCreateTransition()

const createState = ref<CreateState>('IDLE')
const draftPact = ref<Partial<Pact>>({})

const isIdDone = computed(() => ['STATS', 'ITEM', 'DONE'].includes(createState.value))
const isStatsDone = computed(() => ['ITEM', 'DONE'].includes(createState.value))
const time = computed(() =>
  store.blitz ? { id: 0, stats: 0, item: 0 } : { id: 700, stats: 250, item: 500 },
)

const onIdentityCreated = async (id: string, name: string) => {
  draftPact.value = { id, name }
  createState.value = 'ID'

  await sleep(time.value.id)
  createState.value = 'STATS'
}

const onStatsCreated = async (stats: Stats) => {
  draftPact.value.stats = stats

  await sleep(time.value.stats)
  createState.value = 'ITEM'
}

const onItemCreated = async (item: Item) => {
  draftPact.value.items = [item]
  createState.value = 'DONE'
  await sleep(time.value.item)

  store.activeDay?.addPact(draftPact.value as Pact, id)
}
</script>

<template>
  <LayoutBlock class="create" v-bind="$attrs">
    <Transition
      :css="false"
      mode="out-in"
      @leave="onPhaseLeave"
      @before-enter="onPhaseBeforeEnter"
      @enter="onPhaseEnter"
    >
      <CreatePact v-if="createState === 'IDLE'" @id="onIdentityCreated" />

      <div v-else-if="draftPact.name" class="pact">
        <CreateName :name="draftPact.name" />

        <Transition :css="false" @before-enter="onStepBeforeEnter" @enter="onStepEnter">
          <CreateStats v-if="isIdDone" @stats="onStatsCreated" />
        </Transition>

        <Transition :css="false" @before-enter="onStepBeforeEnter" @enter="onStepEnter">
          <CreateItem v-if="isStatsDone" @item="onItemCreated" />
        </Transition>
      </div>
    </Transition>
  </LayoutBlock>
</template>

<style scoped>
.create {
  width: 100%;
  position: relative;
  height: fit-content;
  height: 22.4rem;
}

.pact {
  display: flex;
  flex-flow: column;
  gap: 1rem;
  padding: 1rem;
  min-height: 4rem;
}
</style>
