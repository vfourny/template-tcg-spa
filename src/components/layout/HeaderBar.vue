<template>
  <NLayoutHeader
    bordered
    style="padding: 0 24px; position: sticky; top: 0; z-index: 100"
  >
    <NSpace justify="space-between" align="center" style="height: 56px">
      <RouterLink to="/">TCG SPA</RouterLink>
      <NSpace align="center" :size="16">
        <NText depth="3">{{ auth.user?.username }}</NText>
        <NButton size="small" @click="handleLogout">Déconnexion</NButton>
      </NSpace>
    </NSpace>
  </NLayoutHeader>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

import { useAuthStore } from '../../store/auth.js'

const router = useRouter()
const auth = useAuthStore()

const handleLogout = (): void => {
  auth.logout()
  router.push('/auth/login')
}
</script>
