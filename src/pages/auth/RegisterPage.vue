<template>
  <NSpace
    justify="center"
    align="center"
    style="min-height: 100vh; padding: 24px"
  >
    <NCard title="Inscription" style="width: 400px">
      <NForm @submit.prevent="handleSubmit">
        <NFormItem label="Nom d'utilisateur">
          <NInput v-model:value="username" placeholder="Dresseur42" />
        </NFormItem>
        <NFormItem label="Email">
          <NInput
            v-model:value="email"
            type="email"
            placeholder="votre@email.com"
          />
        </NFormItem>
        <NFormItem label="Mot de passe">
          <NInput
            v-model:value="password"
            type="password"
            placeholder="••••••••"
          />
        </NFormItem>
        <NAlert v-if="error" type="error" style="margin-bottom: 16px">
          {{ error }}
        </NAlert>
        <NButton type="primary" attr-type="submit" :loading="loading" block>
          S'inscrire
        </NButton>
      </NForm>
      <NText style="display: block; text-align: center; margin-top: 16px">
        Déjà un compte ?
        <RouterLink to="/auth/login">Se connecter</RouterLink>
      </NText>
    </NCard>
  </NSpace>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { useAuthStore } from '../../store/auth.js'

const router = useRouter()
const auth = useAuthStore()

const username = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref<string | null>(null)

const handleSubmit = async (): Promise<void> => {
  loading.value = true
  error.value = null
  try {
    await auth.register(email.value, password.value, username.value)
    router.push('/')
  } catch (e) {
    error.value = (e as Error).message
  } finally {
    loading.value = false
  }
}
</script>
