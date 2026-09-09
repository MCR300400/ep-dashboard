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
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
}

@media (prefers-color-scheme: dark) {
  .scheda-metrica {
    background: #1e293b;
    border-color: #334155;
  }
}

.etichetta {
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #64748b;
  margin-bottom: 0.4rem;
}

@media (prefers-color-scheme: dark) {
  .etichetta {
    color: #94a3b8;
  }
}

.valore {
  font-size: 1.75rem;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.2;
}

@media (prefers-color-scheme: dark) {
  .valore {
    color: #f8fafc;
  }
}

.sottotitolo {
  font-size: 0.82rem;
  color: #94a3b8;
  margin-top: 0.35rem;
}

.evidenziato {
  border-color: #93c5fd;
  background: linear-gradient(to bottom right, #ffffff, #eff6ff);
}

@media (prefers-color-scheme: dark) {
  .evidenziato {
    border-color: #1d4ed8;
    background: linear-gradient(to bottom right, #1e293b, #1e3a8a);
  }
}
</style>
