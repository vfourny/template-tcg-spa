<template>
  <div class="container">
    <NSpin v-if="loading" />
    <NAlert v-else-if="error" type="error">{{ error }}</NAlert>

    <template v-else-if="deckStore.currentDeck">
      <!-- Grille 3 colonnes : retour | titre | modifier -->
      <NGrid :cols="3" style="margin-bottom: 24px; align-items: center">
        <NGridItem>
          <NButton @click="router.back()">← Retour</NButton>
        </NGridItem>
        <NGridItem style="text-align: center">
          <h1 style="margin: 0">{{ deckStore.currentDeck.name }}</h1>
        </NGridItem>
        <NGridItem style="text-align: right">
          <NButton
            type="primary"
            @click="router.push(`/decks/${route.params.id}/edit`)"
          >
            Modifier
          </NButton>
        </NGridItem>
      </NGrid>

      <PokemonCardsList :cards="deckCards" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import PokemonCardsList from '../../components/card/PokemonCardsList.vue'
import { useCardStore } from '../../store/card.js'
import { useDeckStore } from '../../store/deck.js'
import type { Card } from '../../types/index.js'

const router = useRouter()
const route = useRoute()
const deckStore = useDeckStore()
const { cards, fetchCards } = useCardStore()

const loading = ref(false)
const error = ref<string | null>(null)

const deckCards = computed<Card[]>(() => {
  if (!deckStore.currentDeck) return []
  return deckStore.currentDeck.cards
    .map((dc) => cards.value.find((c) => c.id === dc.cardId))
    .filter((c): c is Card => !!c)
})

onMounted(async () => {
  loading.value = true
  error.value = null
  try {
    await Promise.all([
      deckStore.fetchDeck(route.params.id as string),
      fetchCards(),
    ])
  } catch (e) {
    error.value = (e as Error).message
  } finally {
    loading.value = false
  }
})
</script>
