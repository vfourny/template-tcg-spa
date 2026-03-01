<template>
  <NConfigProvider>
    <NMessageProvider>
      <NLayout>
        <HeaderBar v-if="auth.isAuthenticated" />
        <NLayoutContent>
          <RouterView />
        </NLayoutContent>
      </NLayout>
    </NMessageProvider>
  </NConfigProvider>
</template>

<script setup lang="ts">
import HeaderBar from './components/layout/HeaderBar.vue'
import { useAuthStore } from './store/auth.js'

const auth = useAuthStore()
</script>

<style>
* {
  margin: 0 5px;
}
</style>
