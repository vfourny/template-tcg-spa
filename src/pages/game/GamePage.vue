<template>
  <div class="game-page">
    <!-- Overlay : partie terminée -->
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

    <!-- Zone adversaire -->
    <div class="zone">
      <NSpace
        justify="space-between"
        align="center"
        style="margin-bottom: 12px"
      >
        <NText depth="2" strong>Adversaire</NText>
        <NTag type="error" size="small">
          {{ opponentBoard?.score ?? 0 }}/3 KO
        </NTag>
      </NSpace>

      <div class="active-slot">
        <ActiveCard
          v-if="opponentBoard?.activeCard"
          :card="opponentBoard.activeCard"
        />
        <NEmpty v-else size="small" description="Aucune carte active" />
      </div>
    </div>

    <!-- Barre d'action centrale -->
    <div class="action-bar">
      <NAlert
        v-if="gameStore.error"
        type="error"
        closable
        style="margin-bottom: 8px"
        @close="gameStore.error = null"
      >
        {{ gameStore.error }}
      </NAlert>

      <NSpace justify="space-between" align="center" :wrap="false">
        <NTag :type="gameStore.isMyTurn ? 'success' : 'warning'" size="large">
          {{ gameStore.isMyTurn ? 'Votre tour' : 'Tour adversaire' }}
        </NTag>

        <NText
          depth="3"
          style="
            font-size: 0.8rem;
            font-style: italic;
            flex: 1;
            text-align: center;
            padding: 0 12px;
          "
        >
          {{ gameStore.message }}
        </NText>

        <NSpace v-if="gameStore.isMyTurn" :size="8">
          <NButton
            size="small"
            :disabled="!canDraw"
            @click="gameStore.drawCards()"
          >
            Piocher
          </NButton>
          <NButton
            size="small"
            type="error"
            :disabled="!canAttack"
            @click="gameStore.attack()"
          >
            Attaquer
          </NButton>
          <NButton size="small" type="warning" @click="gameStore.endTurn()">
            Fin de tour
          </NButton>
        </NSpace>
      </NSpace>
    </div>

    <!-- Zone joueur -->
    <div class="zone">
      <div class="active-slot" style="margin-bottom: 16px">
        <ActiveCard v-if="myBoard?.activeCard" :card="myBoard.activeCard" />
        <NEmpty v-else size="small" description="Aucune carte active" />
      </div>

      <!-- Main -->
      <NText
        depth="3"
        style="display: block; font-size: 0.8rem; margin-bottom: 8px"
      >
        Main ({{ myBoard?.hand?.length ?? 0 }}/5)
        <NText v-if="canPlayCard" type="success" style="margin-left: 8px">
          — cliquez une carte pour la jouer
        </NText>
      </NText>

      <NGrid cols="5" :x-gap="6" :y-gap="6" style="margin-bottom: 12px">
        <NGridItem
          v-for="(handCard, index) in myBoard?.hand ?? []"
          :key="handCard.id"
        >
          <PokemonCard
            :card="handCard"
            size="sm"
            :selectable="canPlayCard"
            @toggle="gameStore.playCard(index)"
          />
        </NGridItem>
      </NGrid>

      <NSpace justify="space-between" align="center">
        <NTag type="success" size="small">
          {{ myBoard?.score ?? 0 }}/3 KO
        </NTag>
        <NText depth="3" style="font-size: 0.75rem">
          Deck : {{ myBoard?.deck?.length ?? 0 }} cartes
        </NText>
      </NSpace>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import ActiveCard from '../../components/card/ActiveCard.vue'
import PokemonCard from '../../components/card/PokemonCard.vue'
import { ROUTES } from '../../router.js'
import { useGameStore } from '../../store/game.js'

const router = useRouter()
const gameStore = useGameStore()

const myBoard = computed(() => gameStore.myBoard)
const opponentBoard = computed(() => gameStore.opponentBoard)

const isWinner = computed(
  () => gameStore.gameOver?.winner === gameStore.socketId,
)

const canDraw = computed(
  () =>
    (myBoard.value?.hand?.length ?? 0) < 5 &&
    (myBoard.value?.deck?.length ?? 0) > 0,
)

const canPlayCard = computed(
  () => gameStore.isMyTurn && !myBoard.value?.activeCard,
)

const canAttack = computed(
  () => !!myBoard.value?.activeCard && !!opponentBoard.value?.activeCard,
)

const returnToLobby = (): void => {
  gameStore.resetGame()
  router.push(ROUTES.HOME)
}
</script>

<style scoped>
.game-page {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 56px);
  overflow: hidden;
}

.zone {
  flex: 1;
  padding: 16px 24px;
  overflow-y: auto;
}

.zone:first-child {
  background: #f9f9f9;
  border-bottom: 1px solid #eee;
}

.active-slot {
  display: flex;
  justify-content: center;
}

.action-bar {
  padding: 12px 24px;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  background: #fff;
  flex-shrink: 0;
}
</style>
