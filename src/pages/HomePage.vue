<template>
  <div class="container">
    <NSpace vertical size="large">
      <GameLobby />
      <DeckList />
    </NSpace>
  </div>
</template>

<script setup lang="ts">
import DeckList from '../components/deck/DeckList.vue'
import GameLobby from '../components/game/GameLobby.vue'
</script>
