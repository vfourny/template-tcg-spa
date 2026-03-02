<template>
  <NGrid cols="6" :x-gap="24" :y-gap="12">
    <NGridItem v-for="card in cards" :key="card.id">
      <PokemonCard
        :card="card"
        :selectable="selectable"
        :selected="selectedIds.includes(card.id)"
        :disabled="
          selectable &&
          selectedIds.length === maxSelected &&
          !selectedIds.includes(card.id)
        "
        @toggle="emit('toggle', card.id)"
      />
    </NGridItem>
  </NGrid>
</template>

<script setup lang="ts">
import type { Card } from '../../types/index.js'
import PokemonCard from './PokemonCard.vue'

withDefaults(
  defineProps<{
    cards: Card[]
    selectable?: boolean
    selectedIds?: number[]
    maxSelected?: number
  }>(),
  {
    selectable: false,
    selectedIds: () => [],
    maxSelected: Infinity,
  },
)

const emit = defineEmits<{ toggle: [cardId: number] }>()
</script>
