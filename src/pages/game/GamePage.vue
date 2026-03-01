<template>
  <div class="game-page">
    <GameOverModal />

    <PlayerZone
      role="opponent"
      label="Adversaire"
      style="background: #f9f9f9; border-bottom: 1px solid #eee"
    />

    <GameActionBar />

    <PlayerZone role="my" label="Vous">
      <PlayerHand />
    </PlayerZone>
  </div>
</template>

<script setup lang="ts">
import GameActionBar from '../../components/game/GameActionBar.vue'
import GameOverModal from '../../components/game/GameOverModal.vue'
import PlayerHand from '../../components/game/PlayerHand.vue'
import PlayerZone from '../../components/game/PlayerZone.vue'
</script>

<style scoped>
.game-page {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 56px);
  overflow: hidden;
}
</style>
