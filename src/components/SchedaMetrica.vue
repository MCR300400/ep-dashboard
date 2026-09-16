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
  border-radius: 12px;
  padding: 1.25rem 1.4rem;
  display: flex;
  flex-direction: column;
  box-shadow: var(--ombra-scheda);
  transition: transform 0.18s ease, border-color 0.18s ease;
}

.scheda-metrica:hover {
  transform: translateY(-2px);
  border-color: var(--accento-bordo);
}

.etichetta {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--testo-terziario);
  margin-bottom: 0.45rem;
}

.valore {
  font-size: 1.85rem;
  font-weight: 850;
  color: var(--testo-primario);
  line-height: 1.15;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
}

.sottotitolo {
  font-size: 0.8rem;
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
