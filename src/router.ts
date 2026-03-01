import { createRouter, createWebHistory } from 'vue-router'

import LoginPage from './pages/auth/LoginPage.vue'
import RegisterPage from './pages/auth/RegisterPage.vue'
import DeckDetailPage from './pages/decks/DeckDetailPage.vue'
import DeckFormPage from './pages/decks/DeckFormPage.vue'
import GamePage from './pages/game/GamePage.vue'
import HomePage from './pages/HomePage.vue'
import { useAuthStore } from './store/auth.js'

export const ROUTES = {
  HOME: '/',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  },
  DECKS: {
    CREATE: '/decks/create',
    DETAIL: '/decks/:id',
    EDIT: '/decks/:id/edit',
  },
  GAME: '/game',
} as const

const routes = [
  { path: ROUTES.HOME, component: HomePage, meta: { requiresAuth: true } },
  { path: ROUTES.AUTH.LOGIN, component: LoginPage, meta: { guestOnly: true } },
  {
    path: ROUTES.AUTH.REGISTER,
    component: RegisterPage,
    meta: { guestOnly: true },
  },
  {
    path: ROUTES.DECKS.CREATE,
    component: DeckFormPage,
    meta: { requiresAuth: true },
  },
  {
    path: ROUTES.DECKS.DETAIL,
    component: DeckDetailPage,
    meta: { requiresAuth: true },
  },
  {
    path: ROUTES.DECKS.EDIT,
    component: DeckFormPage,
    meta: { requiresAuth: true },
  },
  { path: ROUTES.GAME, component: GamePage, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return ROUTES.AUTH.LOGIN
  }

  if (to.meta.guestOnly && auth.isAuthenticated) {
    return ROUTES.HOME
  }

  return true
})

export default router
