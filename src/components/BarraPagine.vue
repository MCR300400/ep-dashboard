<script setup>
defineProps({
  etichetta: { type: String, required: true },
  valore: { type: Number, required: true },
  massimo: { type: Number, required: true }
})
</script>

<template>
  <div class="barra-riga">
    <div class="barra-sfondo" :style="{ width: `${massimo > 0 ? (valore / massimo) * 100 : 0}%` }"></div>
    <div class="barra-contenuto">
      <span class="barra-etichetta" :title="etichetta">{{ etichetta }}</span>
      <span class="barra-valore">{{ valore.toLocaleString('it-IT') }}</span>
    </div>
  </div>
</template>

<style scoped>
.barra-riga {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 0.55rem;
  background: var(--bg-superficie-elevata);
  border: 1px solid var(--bordo-sottile);
  transition: border-color 0.15s ease;
}

.barra-riga:hover {
  border-color: var(--accento-bordo);
}

.barra-sfondo {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  background: var(--accento-sfondo);
  border-radius: 8px;
  transition: width 0.3s ease;
}

.barra-contenuto {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.65rem 0.95rem;
  font-size: 0.88rem;
}

.barra-etichetta {
  font-weight: 550;
  color: var(--testo-primario);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 78%;
  font-family: ui-monospace, monospace;
  font-size: 0.84rem;
}

.barra-valore {
  font-weight: 700;
  color: var(--accento);
  font-variant-numeric: tabular-nums;
}
</style>
