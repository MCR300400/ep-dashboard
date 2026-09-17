<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { getDettaglio } from '../api'
import SchedaMetrica from '../components/SchedaMetrica.vue'
import BarraPagine from '../components/BarraPagine.vue'
import { useLingua } from '../composables/useLingua'

const { isItalian, t } = useLingua()

const props = defineProps({
  id: { type: String, required: true }
})

const giorni = ref(7)
const caricamento = ref(true)
const errore = ref(null)
const dati = ref({ pagine: [], referrer: [], durata_mediana: null })

async function caricaDettagli() {
  caricamento.value = true
  errore.value = null
  try {
    const res = await getDettaglio(props.id, giorni.value)
    if (res) {
      dati.value = res
    }
  } catch (err) {
    errore.value = isItalian.value
      ? 'Impossibile recuperare i dettagli del sito.'
      : 'Unable to retrieve site details.'
    console.error(err)
  } finally {
    caricamento.value = false
  }
}

const formattaSecondi = s => {
  if (!s && s !== 0) return isItalian.value ? 'Dato assente' : 'No data'
  const min = Math.floor(s / 60)
  const sec = s % 60
  return min > 0 ? `${min}m ${sec}s` : `${sec}s`
}

const maxPagine = computed(() => {
  if (!dati.value.pagine || !dati.value.pagine.length) return 1
  return Math.max(...dati.value.pagine.map(p => p.visite))
})

const maxReferrer = computed(() => {
  if (!dati.value.referrer || !dati.value.referrer.length) return 1
  return Math.max(...dati.value.referrer.map(r => r.visite))
})

const totaleVisitePagine = computed(() => {
  return (dati.value.pagine || []).reduce((acc, p) => acc + p.visite, 0)
})

watch(giorni, () => {
  caricaDettagli()
})

onMounted(() => {
  caricaDettagli()
})
</script>

<template>
  <div class="vista-dettaglio">
    <div class="testata-dettaglio">
      <div>
        <RouterLink to="/" class="link-ritorno">
          <span class="freccia-ritorno">&larr;</span>
          <span>{{ t('dettaglio.ritorno') }}</span>
        </RouterLink>
        <h1 class="titolo-sito">{{ t('dettaglio.sito') }} <code>{{ id }}</code></h1>
      </div>

      <div class="selettore-periodo">
        <button
          v-for="p in [7, 30, 90]"
          :key="p"
          class="pulsante-periodo"
          :class="{ attivo: giorni === p }"
          @click="giorni = p"
        >
          {{ t('periodo.ultimi') }} {{ p }} {{ t('periodo.giorni') }}
        </button>
      </div>
    </div>

    <div v-if="errore" class="avviso-errore">
      {{ errore }}
    </div>

    <div class="griglia-metriche">
      <SchedaMetrica
        :etichetta="t('dettaglio.durataMediana')"
        :valore="formattaSecondi(dati.durata_mediana)"
        :sottotitolo="t('dettaglio.durataSotto')"
        evidenziato
      />
      <SchedaMetrica
        :etichetta="t('dettaglio.pagineVisitate')"
        :valore="totaleVisitePagine.toLocaleString(isItalian ? 'it-IT' : 'en-US')"
        :sottotitolo="isItalian ? `Top percorsi negli ultimi ${giorni} gg` : `Top routes in last ${giorni} days`"
      />
      <SchedaMetrica
        :etichetta="t('dettaglio.referrerUnici')"
        :valore="(dati.referrer || []).length"
        :sottotitolo="t('dettaglio.referrerSotto')"
      />
    </div>

    <div class="griglia-sezioni">
      <!-- Top 10 Pagine -->
      <div class="riquadro-sezione">
        <h2 class="titolo-sezione">{{ t('dettaglio.topPagine') }}</h2>
        <div v-if="caricamento" class="testo-caricamento">
          <div class="loader-cerchio"></div>
          <p>{{ t('dettaglio.caricamentoPercorsi') }}</p>
        </div>
        <div v-else-if="!dati.pagine || dati.pagine.length === 0" class="testo-vuoto">
          {{ t('dettaglio.nessunPercorso') }}
        </div>
        <div v-else class="lista-barre">
          <BarraPagine
            v-for="p in dati.pagine"
            :key="p.percorso"
            :etichetta="p.percorso"
            :valore="p.visite"
            :massimo="maxPagine"
          />
        </div>
      </div>

      <!-- Top 10 Referrer -->
      <div class="riquadro-sezione">
        <h2 class="titolo-sezione">{{ t('dettaglio.topReferrer') }}</h2>
        <div v-if="caricamento" class="testo-caricamento">
          <div class="loader-cerchio"></div>
          <p>{{ t('dettaglio.caricamentoSorgenti') }}</p>
        </div>
        <div v-else-if="!dati.referrer || dati.referrer.length === 0" class="testo-vuoto">
          {{ t('dettaglio.nessunReferrer') }}
        </div>
        <div v-else class="lista-barre">
          <BarraPagine
            v-for="r in dati.referrer"
            :key="r.referrer"
            :etichetta="r.referrer"
            :valore="r.visite"
            :massimo="maxReferrer"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.vista-dettaglio {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.link-ritorno {
  font-size: 0.85rem;
  color: var(--accento);
  text-decoration: none;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 0.65rem;
  transition: transform 0.15s ease, color 0.15s ease;
}

.link-ritorno:hover {
  color: var(--accento-hover);
  transform: translateX(-2px);
}

.freccia-ritorno {
  transition: transform 0.15s ease;
}

.link-ritorno:hover .freccia-ritorno {
  transform: translateX(-2px);
}

.testata-dettaglio {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 1.25rem;
}

.titolo-sito {
  font-size: 2rem;
  font-weight: 850;
  color: var(--testo-primario);
  letter-spacing: -0.025em;
}

.titolo-sito code {
  color: var(--accento);
  font-family: ui-monospace, monospace;
  font-size: 0.88em;
  background: var(--bg-superficie-elevata);
  border: 1px solid var(--bordo-medio);
  padding: 0.2rem 0.6rem;
  border-radius: 8px;
}

.selettore-periodo {
  display: inline-flex;
  background: var(--bg-superficie);
  border: 1px solid var(--bordo-medio);
  padding: 3px;
  border-radius: 9px;
  gap: 2px;
}

.pulsante-periodo {
  border: none;
  background: transparent;
  padding: 0.42rem 0.85rem;
  border-radius: 6px;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--testo-secondario);
  cursor: pointer;
  transition: all 0.15s ease;
  user-select: none;
}

.pulsante-periodo:hover {
  color: var(--testo-primario);
}

.pulsante-periodo.attivo {
  background: var(--accento);
  color: #ffffff;
  box-shadow: 0 2px 8px var(--accento-sfondo-hover);
}

.avviso-errore {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #f87171;
  padding: 1rem 1.25rem;
  border-radius: 10px;
  font-size: 0.9rem;
}

.griglia-metriche {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.25rem;
}

.griglia-sezioni {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
}

.riquadro-sezione {
  background: var(--bg-superficie);
  border: 1px solid var(--bordo-medio);
  border-radius: 14px;
  padding: 1.5rem;
  box-shadow: var(--ombra-scheda);
}

.titolo-sezione {
  font-size: 1.15rem;
  font-weight: 750;
  color: var(--testo-primario);
  margin-bottom: 1.35rem;
  letter-spacing: -0.01em;
}

.testo-caricamento {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  color: var(--testo-terziario);
  font-size: 0.9rem;
  padding: 2rem 0;
}

.loader-cerchio {
  width: 24px;
  height: 24px;
  border: 3px solid var(--bordo-medio);
  border-top-color: var(--accento);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.testo-vuoto {
  color: var(--testo-terziario);
  font-size: 0.9rem;
  padding: 2rem 0;
  text-align: center;
  font-style: italic;
}
</style>
