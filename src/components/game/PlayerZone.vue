<template>
  <div class="zone">
    <NSpace justify="space-between" align="center" style="margin-bottom: 12px">
      <NText depth="2" strong>{{ label }}</NText>
      <NTag size="small">{{ board?.score ?? 0 }}/3 KO</NTag>
    </NSpace>

    <div class="active-slot">
      <PokemonCard
        v-if="board?.activeCard"
        :card="board.activeCard"
        :current-hp="board.activeCard.currentHp"
        style="width: 140px"
      />
      <NEmpty v-else size="small" description="Aucune carte active" />
    </div>

    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { useGameStore } from '../../store/game.js'
import PokemonCard from '../card/PokemonCard.vue'

const props = defineProps<{
  role: 'my' | 'opponent'
  label: string
}>()

const gameStore = useGameStore()

const board = computed(() =>
  props.role === 'my' ? gameStore.myBoard : gameStore.opponentBoard,
)
</script>

<style scoped>
.zone {
  flex: 1;
  padding: 16px 24px;
  overflow-y: auto;
}

.active-slot {
  display: flex;
  justify-content: center;
}
</style>
