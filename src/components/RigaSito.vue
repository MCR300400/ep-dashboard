<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import Sparkline from './Sparkline.vue'
import { useLingua } from '../composables/useLingua'

const { isItalian, t } = useLingua()

const props = defineProps({
  sito: { type: Object, required: true },
  trend: { type: Array, default: () => [] }
})

// Calcolo stato: verde (<1h), ambra (>1h), grigio (nessun evento)
const stato = computed(() => {
  if (!props.sito.ultimo_evento) {
    return {
      colore: 'grigio',
      titolo: isItalian.value ? 'Nessun evento registrato' : 'No events recorded'
    }
  }
  const adesso = Date.now()
  const diffOre = (adesso - props.sito.ultimo_evento) / (1000 * 60 * 60)
  if (diffOre <= 1) {
    return {
      colore: 'verde',
      titolo: isItalian.value ? 'Attivo (ultimo evento entro 1 ora)' : 'Active (last event within 1 hour)'
    }
  }
  return {
    colore: 'ambra',
    titolo: isItalian.value
      ? `Silenzio da ${Math.round(diffOre)} ore`
      : `Inactive for ${Math.round(diffOre)} hours`
  }
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
      <span class="dominio-sito">
        {{ sito.dominio || (isItalian ? 'Nessun dominio associato' : 'No domain configured') }}
      </span>
    </td>
    <td class="colonna-visite text-right">
      <span class="valore-principale">{{ sito.visite.toLocaleString(isItalian ? 'it-IT' : 'en-US') }}</span>
    </td>
    <td class="colonna-unici text-right">
      <span class="valore-principale">{{ sito.unici.toLocaleString(isItalian ? 'it-IT' : 'en-US') }}</span>
    </td>
    <td class="colonna-trend">
      <div class="sparkline-wrapper">
        <Sparkline :valori="valoriSparkline" :larghezza="80" :altezza="24" class="sparkline-grafico" />
      </div>
    </td>
    <td class="colonna-azione text-right">
      <RouterLink :to="`/siti/${sito.id}`" class="pulsante-dettaglio">
        <span>{{ t('tabella.dettagli') }}</span>
        <span class="freccia-dettaglio">&rarr;</span>
      </RouterLink>
    </td>
  </tr>
</template>

<style scoped>
.riga-sito td {
  padding: 1.05rem 0.85rem;
  border-bottom: 1px solid var(--bordo-sottile);
  vertical-align: middle;
  transition: background-color 0.15s ease;
}

.riga-sito:hover td {
  background-color: var(--bg-superficie-elevata);
}

.colonna-stato {
  width: 44px;
}

.pallino-stato {
  display: inline-block;
  width: 9px;
  height: 9px;
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
  background-color: var(--testo-terziario);
}

.colonna-sito {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.nome-sito {
  font-weight: 650;
  color: var(--testo-primario);
  text-decoration: none;
  font-size: 0.95rem;
  transition: color 0.15s ease;
}

.nome-sito:hover {
  color: var(--accento);
}

.dominio-sito {
  font-size: 0.78rem;
  color: var(--testo-terziario);
  font-family: ui-monospace, monospace;
}

.valore-principale {
  font-weight: 650;
  font-size: 0.95rem;
  color: var(--testo-primario);
  font-variant-numeric: tabular-nums;
}

.text-right {
  text-align: right;
}

.sparkline-wrapper {
  display: flex;
  justify-content: center;
  color: var(--accento);
}

.colonna-azione {
  white-space: nowrap;
  width: 130px;
  min-width: 130px;
}

.pulsante-dettaglio {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  white-space: nowrap;
  font-size: 0.82rem;
  font-weight: 650;
  color: var(--accento);
  text-decoration: none;
  padding: 0.42rem 0.85rem;
  border-radius: 8px;
  background: var(--accento-sfondo);
  border: 1px solid var(--accento-bordo);
  transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease;
  user-select: none;
  box-sizing: border-box;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

.pulsante-dettaglio:hover {
  background: var(--accento);
  color: #ffffff;
  border-color: var(--accento);
}

.freccia-dettaglio {
  display: inline-block;
  font-size: 0.92rem;
  line-height: 1;
  transition: transform 0.18s ease;
}

.pulsante-dettaglio:hover .freccia-dettaglio {
  transform: translateX(3px);
}
</style>
