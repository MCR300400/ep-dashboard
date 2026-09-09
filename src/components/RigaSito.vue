<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import Sparkline from './Sparkline.vue'

const props = defineProps({
  sito: { type: Object, required: true },
  trend: { type: Array, default: () => [] }
})

// Calcolo stato: verde (<1h), ambra (>1h), grigio (nessun evento)
const stato = computed(() => {
  if (!props.sito.ultimo_evento) {
    return { colore: 'grigio', titolo: 'Nessun evento registrato' }
  }
  const adesso = Date.now()
  const diffOre = (adesso - props.sito.ultimo_evento) / (1000 * 60 * 60)
  if (diffOre <= 1) {
    return { colore: 'verde', titolo: 'Attivo (ultimo evento entro 1 ora)' }
  }
  return { colore: 'ambra', titolo: `Silenzio da ${Math.round(diffOre)} ore` }
})

const valoriSparkline = computed(() => {
  return props.trend.length ? props.trend.map(t => t.visite) : [0, 0]
})
</script>

<template>
  <tr class="riga-sito">
    <td class="colonna-stato">
      <span class="pallino-stato" :class="stato.colore" :title="stato.titolo"></span>
    </td>
    <td class="colonna-sito">
      <RouterLink :to="`/siti/${sito.id}`" class="nome-sito">{{ sito.nome }}</RouterLink>
      <span class="dominio-sito">{{ sito.dominio || 'Nessun dominio associato' }}</span>
    </td>
    <td class="colonna-visite text-right">
      <span class="valore-principale">{{ sito.visite.toLocaleString('it-IT') }}</span>
    </td>
    <td class="colonna-unici text-right">
      <span class="valore-principale">{{ sito.unici.toLocaleString('it-IT') }}</span>
    </td>
    <td class="colonna-trend">
      <div class="sparkline-wrapper">
        <Sparkline :valori="valoriSparkline" :larghezza="80" :altezza="24" class="sparkline-grafico" />
      </div>
    </td>
    <td class="colonna-azione text-right">
      <RouterLink :to="`/siti/${sito.id}`" class="pulsante-dettaglio">
        Dettagli &rarr;
      </RouterLink>
    </td>
  </tr>
</template>

<style scoped>
.riga-sito td {
  padding: 1rem 0.75rem;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
}

@media (prefers-color-scheme: dark) {
  .riga-sito td {
    border-bottom-color: #1e293b;
  }
}

.pallino-stato {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.pallino-stato.verde {
  background-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
}

.pallino-stato.ambra {
  background-color: #f59e0b;
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.2);
}

.pallino-stato.grigio {
  background-color: #94a3b8;
}

.colonna-sito {
  display: flex;
  flex-direction: column;
}

.nome-sito {
  font-weight: 600;
  color: #0f172a;
  text-decoration: none;
  font-size: 0.95rem;
}

.nome-sito:hover {
  color: #2563eb;
}

@media (prefers-color-scheme: dark) {
  .nome-sito {
    color: #f8fafc;
  }
  .nome-sito:hover {
    color: #60a5fa;
  }
}

.dominio-sito {
  font-size: 0.8rem;
  color: #64748b;
}

.valore-principale {
  font-weight: 600;
  font-size: 0.95rem;
}

.text-right {
  text-align: right;
}

.sparkline-wrapper {
  display: flex;
  justify-content: center;
  color: #2563eb;
}

@media (prefers-color-scheme: dark) {
  .sparkline-wrapper {
    color: #60a5fa;
  }
}

.pulsante-dettaglio {
  font-size: 0.82rem;
  font-weight: 500;
  color: #2563eb;
  text-decoration: none;
  padding: 0.35rem 0.7rem;
  border-radius: 6px;
  background: rgba(37, 99, 235, 0.06);
  transition: all 0.15s ease;
}

.pulsante-dettaglio:hover {
  background: rgba(37, 99, 235, 0.15);
}
</style>
