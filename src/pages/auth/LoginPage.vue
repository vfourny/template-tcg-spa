<template>
  <NSpace
    justify="center"
    align="center"
    style="min-height: 100vh; padding: 24px"
  >
    <NCard title="Connexion" style="width: 400px">
      <NForm @submit.prevent="handleSubmit">
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
          Se connecter
        </NButton>
      </NForm>
      <NText style="display: block; text-align: center; margin-top: 16px">
        Pas encore de compte ?
        <RouterLink to="/auth/register">S'inscrire</RouterLink>
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

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref<string | null>(null)

const handleSubmit = async (): Promise<void> => {
  loading.value = true
  error.value = null
  try {
    await auth.login(email.value, password.value)
    router.push('/')
  } catch (e) {
    error.value = (e as Error).message
  } finally {
    loading.value = false
  }
}
</script>
