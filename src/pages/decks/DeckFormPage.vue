<template>
  <div class="container">
    <NSpace align="center" style="margin-bottom: 24px">
      <NButton @click="router.back()">← Retour</NButton>
      <h1 style="margin: 0">
        {{ route.params.id ? 'Modifier le deck' : 'Créer un deck' }}
      </h1>
    </NSpace>

    <NForm @submit.prevent="handleSubmit">
      <NFormItem label="Nom du deck">
        <NInput v-model:value="deckName" placeholder="Mon super deck" />
      </NFormItem>

      <NText
        :type="selectedIds.length === 10 ? 'success' : 'default'"
        style="display: block; margin-bottom: 16px"
      >
        {{ selectedIds.length }}/10 cartes sélectionnées
      </NText>

      <NAlert v-if="error" type="error" style="margin-bottom: 16px">
        {{ error }}
      </NAlert>

      <NButton
        type="primary"
        attr-type="submit"
        :loading="submitting"
        :disabled="selectedIds.length !== 10 || !deckName"
        block
        style="margin-bottom: 24px"
      >
        {{ route.params.id ? 'Enregistrer' : 'Créer le deck' }}
      </NButton>
    </NForm>

    <NSpin v-if="cardsLoading" />
    <NAlert v-else-if="cardsError" type="error">{{ cardsError }}</NAlert>

    <PokemonCardsList
      v-else
      :cards="cards"
      selectable
      :selected-ids="selectedIds"
      :max-selected="10"
      @toggle="toggleCard"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router'

import PokemonCardsList from '../../components/card/PokemonCardsList.vue'
import { useCards } from '../../composables/useCards.js'
import { ROUTES } from '../../router.js'
import { useDeckStore } from '../../store/deck.js'

const router = useRouter()
const route = useRoute()
const deckStore = useDeckStore()

const {
  cards,
  loading: cardsLoading,
  error: cardsError,
  fetchCards,
} = useCards()

const deckName = ref('')
const selectedIds = ref<number[]>([])
const submitting = ref(false)
const error = ref<string | null>(null)

const loadDeck = async (id: string | string[]): Promise<void> => {
  error.value = null
  try {
    await deckStore.fetchDeck(id as string)
    const deck = deckStore.currentDeck
    if (deck) {
      deckName.value = deck.name
      selectedIds.value = deck.cards.map((dc) => dc.cardId)
    }
  } catch (e) {
    error.value = (e as Error).message
  }
}

onMounted(async () => {
  await fetchCards()
  if (route.params.id) {
    await loadDeck(route.params.id)
  }
})

onBeforeRouteUpdate(async (to) => {
  if (to.params.id) {
    await loadDeck(to.params.id)
  } else {
    deckName.value = ''
    selectedIds.value = []
  }
})

const toggleCard = (cardId: number): void => {
  if (selectedIds.value.includes(cardId)) {
    selectedIds.value = selectedIds.value.filter((id) => id !== cardId)
  } else if (selectedIds.value.length < 10) {
    selectedIds.value = [...selectedIds.value, cardId]
  }
}

const handleSubmit = async (): Promise<void> => {
  submitting.value = true
  error.value = null
  try {
    if (route.params.id) {
      await deckStore.updateDeck(
        route.params.id as string,
        deckName.value,
        selectedIds.value,
      )
    } else {
      await deckStore.createDeck(deckName.value, selectedIds.value)
    }
    router.push(ROUTES.HOME)
  } catch (e) {
    error.value = (e as Error).message
  } finally {
    submitting.value = false
  }
}
</script>
