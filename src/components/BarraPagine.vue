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
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 0.5rem;
  background: #f8fafc;
}

@media (prefers-color-scheme: dark) {
  .barra-riga {
    background: #0f172a;
  }
}

.barra-sfondo {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  background: rgba(37, 99, 235, 0.12);
  border-radius: 6px;
  transition: width 0.3s ease;
}

@media (prefers-color-scheme: dark) {
  .barra-sfondo {
    background: rgba(37, 99, 235, 0.25);
  }
}

.barra-contenuto {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.6rem 0.85rem;
  font-size: 0.88rem;
}

.barra-etichetta {
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 80%;
}

.barra-valore {
  font-weight: 600;
  color: #2563eb;
}

@media (prefers-color-scheme: dark) {
  .barra-valore {
    color: #60a5fa;
  }
}
</style>
