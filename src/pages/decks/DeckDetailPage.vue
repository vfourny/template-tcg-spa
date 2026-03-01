<template>
  <div class="container">
    <NSpin v-if="loading" />
    <NAlert v-else-if="error" type="error">{{ error }}</NAlert>

    <template v-else-if="deck">
      <!-- Grille 3 colonnes : retour | titre | modifier -->
      <NGrid :cols="3" style="margin-bottom: 24px; align-items: center">
        <NGridItem>
          <NButton @click="router.back()">← Retour</NButton>
        </NGridItem>
        <NGridItem style="text-align: center">
          <h1 style="margin: 0">{{ deck.name }}</h1>
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
import { useApi } from '../../composables/useApi.js'
import type { Card, Deck } from '../../types/index.js'

const router = useRouter()
const route = useRoute()
const api = useApi()

const deck = ref<Deck | null>(null)
const cards = ref<Card[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const deckCards = computed<Card[]>(() => {
  if (!deck.value) return []
  return deck.value.cards
    .map((dc) => cards.value.find((c) => c.id === dc.cardId))
    .filter((c): c is Card => !!c)
})

onMounted(async () => {
  loading.value = true
  error.value = null
  try {
    ;[deck.value, cards.value] = await Promise.all([
      api.getDeck(route.params.id as string),
      api.getCards(),
    ])
  } catch (e) {
    error.value = (e as Error).message
  } finally {
    loading.value = false
  }
})
</script>
