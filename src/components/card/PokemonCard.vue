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
    <NText
      depth="3"
      :style="{ fontSize: size === 'sm' ? '0.7rem' : '0.75rem' }"
    >
      ❤ {{ card.hp }} · ⚔ {{ card.attack }}
    </NText>
  </div>
</template>

<script setup lang="ts">
import { useColors } from '../../composables/useColors.js'
import type { Card } from '../../types/index.js'

const { COLORS, getTypeColor } = useColors()

withDefaults(
  defineProps<{
    card: Card
    size?: 'sm' | 'md'
    selectable?: boolean
    selected?: boolean
    disabled?: boolean
  }>(),
  { size: 'md', selectable: false, selected: false, disabled: false },
)

const emit = defineEmits<{ toggle: [] }>()
</script>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: 100%;
}

.card-img {
  width: 100%;
  border-radius: 6px;
  display: block;
}

.card.selectable {
  cursor: pointer;
  border: 3px solid transparent;
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
