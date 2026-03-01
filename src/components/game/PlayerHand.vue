<template>
  <div>
    <NText
      depth="3"
      style="display: block; font-size: 0.8rem; margin: 12px 0 8px"
    >
      Main ({{ gameStore.myBoard?.hand?.length ?? 0 }}/5)
      <NText v-if="canPlayCard" type="success" style="margin-left: 8px">
        — cliquez une carte pour la jouer
      </NText>
    </NText>

    <NGrid cols="5" :x-gap="6" :y-gap="6" style="margin-bottom: 12px">
      <NGridItem
        v-for="(card, index) in gameStore.myBoard?.hand ?? []"
        :key="card.id"
      >
        <PokemonCard
          :card="card"
          size="sm"
          :selectable="canPlayCard"
          @toggle="gameStore.playCard(index)"
        />
      </NGridItem>
    </NGrid>

    <NText depth="3" style="font-size: 0.75rem">
      Deck : {{ gameStore.myBoard?.deck?.length ?? 0 }} cartes
    </NText>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { useGameStore } from '../../store/game.js'
import PokemonCard from '../card/PokemonCard.vue'

const gameStore = useGameStore()

const canPlayCard = computed(
  () => gameStore.isMyTurn && !gameStore.myBoard?.activeCard,
)
</script>
