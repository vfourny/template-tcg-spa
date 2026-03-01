<template>
  <NCard size="small" style="width: 140px; overflow: hidden">
    <template #cover>
      <img
        :src="card.imgUrl"
        :alt="card.name"
        style="width: 100%; display: block"
      />
    </template>
    <NText
      strong
      style="font-size: 0.85rem; display: block; margin-bottom: 4px"
    >
      {{ card.name }}
    </NText>
    <NProgress
      type="line"
      :percentage="hpPercent"
      :color="hpColor"
      :rail-color="'#eee'"
      :height="8"
      :show-indicator="false"
      style="margin-bottom: 4px"
    />
    <NText depth="3" style="font-size: 0.75rem">
      ❤ {{ card.currentHp }}/{{ card.hp }} · ⚔ {{ card.attack }}
    </NText>
  </NCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { useColors } from '../../composables/useColors.js'
import type { GameCard } from '../../types/index.js'

const props = defineProps<{ card: GameCard }>()

const { hpColor: getHpColor } = useColors()

const hpPercent = computed(() =>
  Math.round((props.card.currentHp / props.card.hp) * 100),
)

const hpColor = computed(() => getHpColor(hpPercent.value))
</script>
