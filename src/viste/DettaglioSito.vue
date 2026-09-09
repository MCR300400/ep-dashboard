<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { getDettaglio } from '../api'
import SchedaMetrica from '../components/SchedaMetrica.vue'
import BarraPagine from '../components/BarraPagine.vue'

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
    errore.value = 'Impossibile recuperare i dettagli del sito.'
    console.error(err)
  } finally {
    caricamento.value = false
  }
}

const formattaSecondi = s => {
  if (!s && s !== 0) return 'Dato assente'
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
        <RouterLink to="/" class="link-ritorno">&larr; Torna alla Panoramica</RouterLink>
        <h1 class="titolo-sito">Sito: <code>{{ id }}</code></h1>
      </div>

      <div class="selettore-periodo">
        <button
          v-for="p in [7, 30, 90]"
          :key="p"
          class="pulsante-periodo"
          :class="{ attivo: giorni === p }"
          @click="giorni = p"
        >
          Ultimi {{ p }} giorni
        </button>
      </div>
    </div>

    <div v-if="errore" class="avviso-errore">
      {{ errore }}
    </div>

    <div class="griglia-metriche">
      <SchedaMetrica
        etichetta="Durata Mediana"
        :valore="formattaSecondi(dati.durata_mediana)"
        sottotitolo="Calcolata da eventi reali di chiusura"
        evidenziato
      />
      <SchedaMetrica
        etichetta="Visualizzazioni Pagine"
        :valore="totaleVisitePagine.toLocaleString('it-IT')"
        :sottotitolo="`Top percorsi negli ultimi ${giorni} gg`"
      />
      <SchedaMetrica
        etichetta="Fonti Referrer Uniche"
        :valore="(dati.referrer || []).length"
        sottotitolo="Domini esterni tracciati"
      />
    </div>

    <div class="griglia-sezioni">
      <!-- Top 10 Pagine -->
      <div class="riquadro-sezione">
        <h2 class="titolo-sezione">Pagine più visitate</h2>
        <div v-if="caricamento" class="testo-caricamento">Caricamento pagine...</div>
        <div v-else-if="!dati.pagine || dati.pagine.length === 0" class="testo-vuoto">
          Nessuna visualizzazione registrata per questo periodo.
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
        <h2 class="titolo-sezione">Sorgenti di traffico (Referrer)</h2>
        <div v-if="caricamento" class="testo-caricamento">Caricamento sorgenti...</div>
        <div v-else-if="!dati.referrer || dati.referrer.length === 0" class="testo-vuoto">
          Nessun referrer registrato (visite dirette o referrer non inviato).
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
  color: #2563eb;
  text-decoration: none;
  font-weight: 500;
  display: inline-block;
  margin-bottom: 0.5rem;
}

.link-ritorno:hover {
  text-decoration: underline;
}

.testata-dettaglio {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 1rem;
}

.titolo-sito {
  font-size: 1.8rem;
  font-weight: 800;
}

.titolo-sito code {
  color: #2563eb;
  font-size: 0.9em;
}

.selettore-periodo {
  display: flex;
  background: #e2e8f0;
  padding: 3px;
  border-radius: 8px;
  gap: 2px;
}

@media (prefers-color-scheme: dark) {
  .selettore-periodo {
    background: #1e293b;
  }
}

.pulsante-periodo {
  border: none;
  background: transparent;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  transition: all 0.15s ease;
}

@media (prefers-color-scheme: dark) {
  .pulsante-periodo {
    color: #94a3b8;
  }
}

.pulsante-periodo.attivo {
  background: #ffffff;
  color: #0f172a;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  font-weight: 600;
}

@media (prefers-color-scheme: dark) {
  .pulsante-periodo.attivo {
    background: #334155;
    color: #f8fafc;
  }
}

.avviso-errore {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
  padding: 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
}

.griglia-metriche {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.25rem;
}

.griglia-sezioni {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
}

.riquadro-sezione {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
}

@media (prefers-color-scheme: dark) {
  .riquadro-sezione {
    background: #1e293b;
    border-color: #334155;
  }
}

.titolo-sezione {
  font-size: 1.15rem;
  font-weight: 700;
  margin-bottom: 1.25rem;
}

.testo-caricamento,
.testo-vuoto {
  color: #94a3b8;
  font-size: 0.9rem;
  padding: 1.5rem 0;
  text-align: center;
}
</style>
