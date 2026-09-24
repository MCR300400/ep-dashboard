<script setup>
defineProps({
  etichetta: { type: String, required: true },
  valore: { type: [String, Number], required: true },
  sottotitolo: { type: String, default: '' },
  evidenziato: { type: Boolean, default: false }
})
</script>

<template>
  <div class="scheda-metrica" :class="{ evidenziato }">
    <span class="etichetta">{{ etichetta }}</span>
    <div class="valore">{{ valore }}</div>
    <span v-if="sottotitolo" class="sottotitolo">{{ sottotitolo }}</span>
  </div>
</template>

<style scoped>
.scheda-metrica {
  background: var(--bg-superficie);
  border: 1px solid var(--bordo-medio);
  border-radius: 8px;
  padding: 1.2rem 1.35rem;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: border-color 0.16s ease;
}

.scheda-metrica:hover {
  border-color: var(--accento-bordo);
}

.etichetta {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--testo-terziario);
  margin-bottom: 0.45rem;
  letter-spacing: -0.01em;
}

.valore {
  font-size: 1.85rem;
  font-weight: 800;
  color: var(--testo-primario);
  line-height: 1.15;
  letter-spacing: -0.025em;
  font-variant-numeric: tabular-nums;
}

.sottotitolo {
  font-size: 0.78rem;
  color: var(--testo-terziario);
  margin-top: 0.4rem;
}

.evidenziato {
  border-color: var(--accento-bordo);
  background: linear-gradient(135deg, var(--bg-superficie), var(--accento-sfondo));
}

.evidenziato .valore {
  color: var(--accento);
}
</style>
