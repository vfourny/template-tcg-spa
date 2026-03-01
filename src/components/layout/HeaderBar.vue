<template>
  <NLayoutHeader
    bordered
    style="padding: 0 24px; position: sticky; top: 0; z-index: 100"
  >
    <NSpace justify="space-between" align="center" style="height: 56px">
      <NSpace align="center" :size="16">
        <RouterLink to="/">TCG SPA</RouterLink>
        <NButton
          tag="a"
          :href="`${apiBaseUrl.replace('/api', '')}/api-docs`"
          target="_blank"
          text
          size="small"
        >
          API Docs
        </NButton>
      </NSpace>
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
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL as string

const handleLogout = (): void => {
  auth.logout()
  router.push('/auth/login')
}
</script>
