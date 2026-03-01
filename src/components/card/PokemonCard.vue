<template>
  <div
    class="card"
    :class="{ selectable, selected, disabled }"
    @click="selectable && !disabled && emit('toggle')"
  >
    <img :src="card.imgUrl" :alt="card.name" class="card-img" />
    <NText
      depth="3"
      :style="{ fontSize: size === 'sm' ? '0.7rem' : '0.75rem' }"
    >
      #{{ card.pokedexNumber }}
    </NText>
    <NText strong :style="{ fontSize: size === 'sm' ? '0.8rem' : '0.9rem' }">
      {{ card.name }}
    </NText>
    <NTag
      :color="{
        color: getTypeColor(card.type),
        textColor: '#fff',
        borderColor: 'transparent',
      }"
      size="small"
      >{{ card.type }}</NTag
    >
    <template v-if="currentHp !== undefined">
      <NProgress
        type="line"
        :percentage="hpPercent"
        :color="hpColor"
        rail-color="#eee"
        :height="6"
        :show-indicator="false"
        style="width: 80%"
      />
      <NText
        depth="3"
        :style="{ fontSize: size === 'sm' ? '0.7rem' : '0.75rem' }"
      >
        ❤ {{ currentHp }}/{{ card.hp }} · ⚔ {{ card.attack }}
      </NText>
    </template>
    <NText
      v-else
      depth="3"
      :style="{ fontSize: size === 'sm' ? '0.7rem' : '0.75rem' }"
    >
      ❤ {{ card.hp }} · ⚔ {{ card.attack }}
    </NText>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { useColors } from '../../composables/useColors.js'
import type { Card } from '../../types/index.js'

const { COLORS, getTypeColor, hpColor: getHpColor } = useColors()

const props = withDefaults(
  defineProps<{
    card: Card
    size?: 'sm' | 'md'
    selectable?: boolean
    selected?: boolean
    disabled?: boolean
    currentHp?: number
  }>(),
  { size: 'md', selectable: false, selected: false, disabled: false },
)

const emit = defineEmits<{ toggle: [] }>()

const hpPercent = computed(() =>
  props.currentHp !== undefined
    ? Math.round((props.currentHp / props.card.hp) * 100)
    : 100,
)

const hpColor = computed(() => getHpColor(hpPercent.value))
</script>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: 100%;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  padding: 8px 4px;
}

.card-img {
  width: 50%;
  border-radius: 6px;
  display: block;
}

.card.selectable {
  cursor: pointer;
}

.card.selectable:hover:not(.disabled) {
  border-color: v-bind('COLORS.borderHover');
}

.card.selected {
  border-color: v-bind('COLORS.success');
  background: v-bind('COLORS.successLight');
}

.card.disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
