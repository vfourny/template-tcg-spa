<template>
  <NModal :show="!!gameStore.gameOver" :mask-closable="false">
    <NCard style="width: 360px; text-align: center" title="Partie terminée">
      <NText style="font-size: 2rem; display: block; margin-bottom: 8px">
        {{ isWinner ? '🏆' : '💀' }}
      </NText>
      <NText
        strong
        style="font-size: 1.2rem; display: block; margin-bottom: 8px"
      >
        {{ isWinner ? 'Victoire !' : 'Défaite !' }}
      </NText>
      <NText depth="3" style="display: block; margin-bottom: 24px">
        {{ gameStore.gameOver?.message }}
      </NText>
      <NButton type="primary" block @click="returnToLobby">
        Retour au lobby
      </NButton>
    </NCard>
  </NModal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import { ROUTES } from '../../router.js'
import { useGameStore } from '../../store/game.js'

const gameStore = useGameStore()
const router = useRouter()

const isWinner = computed(
  () => gameStore.gameOver?.winner === gameStore.socketId,
)

const returnToLobby = (): void => {
  gameStore.resetGame()
  router.push(ROUTES.HOME)
}
</script>
