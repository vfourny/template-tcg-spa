<template>
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
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { useGameStore } from '../../store/game.js'

const gameStore = useGameStore()

const canDraw = computed(
  () =>
    (gameStore.myBoard?.hand?.length ?? 0) < 5 &&
    (gameStore.myBoard?.deck?.length ?? 0) > 0,
)

const canAttack = computed(
  () =>
    !!gameStore.myBoard?.activeCard && !!gameStore.opponentBoard?.activeCard,
)
</script>

<style scoped>
.action-bar {
  padding: 12px 24px;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  background: #fff;
  flex-shrink: 0;
}
</style>
