<template>
  <div>
    <h2 style="margin: 0 0 24px">Jouer</h2>

    <NAlert
      v-if="gameStore.error"
      type="error"
      closable
      style="margin-bottom: 16px"
      @close="gameStore.error = null"
    >
      {{ gameStore.error }}
    </NAlert>

    <NAlert
      v-if="gameStore.roomId && !gameStore.gameState"
      type="info"
      style="margin-bottom: 16px"
    >
      Room #{{ gameStore.roomId }} créée — en attente d'un adversaire...
    </NAlert>

    <NSpin v-if="!gameStore.isConnected" />

    <NGrid v-else cols="2" :x-gap="24" :y-gap="24">
      <!-- Left: créer une partie -->
      <NGridItem>
        <NCard title="Créer une partie">
          <NSelect
            v-model:value="createDeckId"
            :options="deckOptions"
            placeholder="Sélectionner un deck"
            style="margin-bottom: 16px"
          />
          <NButton
            type="primary"
            :disabled="!createDeckId"
            @click="handleCreate"
          >
            Créer la partie
          </NButton>
        </NCard>
      </NGridItem>

      <!-- Right: parties disponibles -->
      <NGridItem>
        <NCard title="Parties disponibles">
          <NEmpty
            v-if="gameStore.rooms.length === 0"
            description="Aucune partie disponible pour l'instant."
          />
          <NSpace v-else vertical>
            <NCard
              v-for="room in gameStore.rooms"
              :key="room.id"
              :title="`Partie #${room.id}`"
              size="small"
            >
              <NText
                depth="3"
                style="font-size: 0.85rem; display: block; margin-bottom: 12px"
              >
                Hôte : {{ room.hostSocketId.slice(0, 8) }}...
              </NText>
              <NSelect
                v-model:value="joinDeckIds[room.id]"
                :options="deckOptions"
                placeholder="Sélectionner un deck"
                style="margin-bottom: 12px"
              />
              <NButton
                type="primary"
                size="small"
                :disabled="!joinDeckIds[room.id]"
                @click="handleJoin(room.id)"
              >
                Rejoindre
              </NButton>
            </NCard>
          </NSpace>
        </NCard>
      </NGridItem>
    </NGrid>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'

import { useAuthStore } from '../../store/auth.js'
import { useDeckStore } from '../../store/deck.js'
import { useGameStore } from '../../store/game.js'

const gameStore = useGameStore()
const authStore = useAuthStore()
const deckStore = useDeckStore()

const createDeckId = ref<number | null>(null)
const joinDeckIds = reactive<Record<number, number | null>>({})

const deckOptions = computed(() =>
  deckStore.decks.map((d) => ({ label: d.name, value: d.id })),
)

onMounted(() => {
  if (!gameStore.isConnected && authStore.token) {
    gameStore.connect(authStore.token)
  }
  gameStore.getRooms()
})

const handleCreate = (): void => {
  if (!createDeckId.value) return
  gameStore.createRoom(createDeckId.value)
}

const handleJoin = (roomId: number): void => {
  const deckId = joinDeckIds[roomId]
  if (!deckId) return
  gameStore.joinRoom(roomId, deckId)
}
</script>
