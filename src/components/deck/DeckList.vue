<template>
  <div>
    <NSpace justify="space-between" align="center" style="margin-bottom: 24px">
      <h2 style="margin: 0">Mes decks</h2>
      <NButton type="primary" @click="router.push('/decks/create')">
        + Nouveau deck
      </NButton>
    </NSpace>

    <NSpin v-if="loading" />
    <NAlert v-else-if="error" type="error">{{ error }}</NAlert>
    <NEmpty
      v-else-if="decks.length === 0"
      description="Aucun deck pour l'instant."
    />

    <NGrid v-else cols="1 s:2 l:3" :x-gap="16" :y-gap="16">
      <NGridItem v-for="deck in decks" :key="deck.id">
        <NCard
          :title="deck.name"
          hoverable
          style="cursor: pointer; height: 100%"
          @click="router.push(`/decks/${deck.id}`)"
        >
          <template #footer>
            <NSpace justify="end" @click.stop>
              <NButton
                size="small"
                @click="router.push(`/decks/${deck.id}/edit`)"
              >
                Modifier
              </NButton>
              <NPopconfirm @positive-click="handleDelete(deck.id)">
                <template #trigger>
                  <NButton size="small" type="error">Supprimer</NButton>
                </template>
                Supprimer ce deck ?
              </NPopconfirm>
            </NSpace>
          </template>
        </NCard>
      </NGridItem>
    </NGrid>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useApi } from '../../composables/useApi.js'
import type { Deck } from '../../types/index.js'

const router = useRouter()
const api = useApi()

const decks = ref<Deck[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

onMounted(async () => {
  loading.value = true
  error.value = null
  try {
    decks.value = await api.getMyDecks()
  } catch (e) {
    error.value = (e as Error).message
  } finally {
    loading.value = false
  }
})

const handleDelete = async (id: number): Promise<void> => {
  try {
    await api.deleteDeck(id)
    decks.value = decks.value.filter((d) => d.id !== id)
  } catch (e) {
    error.value = (e as Error).message
  }
}
</script>
