<script setup>
import { computed } from 'vue'

const props = defineProps({
  valori: { type: Array, required: true },
  larghezza: { type: Number, default: 72 },
  altezza: { type: Number, default: 26 }
})

const punti = computed(() => {
  const v = props.valori
  if (v.length < 2) return ''
  const max = Math.max(...v, 1)
  const min = Math.min(...v)
  const range = max - min || 1
  const passo = props.larghezza / (v.length - 1)
  return v.map((n, i) => {
    const x = Math.round(i * passo)
    const y = Math.round(props.altezza - ((n - min) / range) * props.altezza)
    return `${x},${y}`
  }).join(' ')
})
</script>

<template>
  <svg :width="larghezza" :height="altezza" aria-hidden="true" class="sparkline-svg">
    <polyline :points="punti" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
</template>

<style scoped>
.sparkline-svg {
  display: block;
}
</style>
