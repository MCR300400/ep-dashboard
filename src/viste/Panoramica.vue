<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { getPanoramica } from '../api'
import SchedaMetrica from '../components/SchedaMetrica.vue'
import RigaSito from '../components/RigaSito.vue'

const giorni = ref(7)
const caricamento = ref(true)
const errore = ref(null)
const dati = ref({ siti: [], trend: [] })
let timerAggiornamento = null

async function caricaDati() {
  caricamento.value = true
  errore.value = null
  try {
    const res = await getPanoramica(giorni.value)
    if (res) {
      dati.value = res
    }
  } catch (err) {
    errore.value = 'Impossibile caricare i dati della panoramica. Verifica la connessione o i permessi di Cloudflare Access.'
    console.error(err)
  } finally {
    caricamento.value = false
  }
}

// Raggruppamento trend per sito_id (lato client, come da documentazione)
const trendPerSito = computed(() => {
  const mappa = {}
  for (const t of dati.value.trend || []) {
    if (!mappa[t.sito_id]) mappa[t.sito_id] = []
    mappa[t.sito_id].push(t)
  }
  return mappa
})

// Metriche complessive
const totaleVisite = computed(() => {
  return (dati.value.siti || []).reduce((acc, s) => acc + (s.visite || 0), 0)
})

const totaleUnici = computed(() => {
  return (dati.value.siti || []).reduce((acc, s) => acc + (s.unici || 0), 0)
})

const sitiAttivi = computed(() => {
  return (dati.value.siti || []).length
})

// Stima quota ingest (Cloudflare Free Workers: 100.000 req/giorno)
const stimaQuota = computed(() => {
  const mediaGiornaliera = Math.round(totaleVisite.value / giorni.value)
  const percentuale = ((mediaGiornaliera / 100000) * 100).toFixed(2)
  return `${percentuale}%`
})

watch(giorni, () => {
  caricaDati()
})

onMounted(() => {
  caricaDati()
  // Refresh ogni 60 secondi (come da sez. 6.4)
  timerAggiornamento = setInterval(caricaDati, 60000)
})

onUnmounted(() => {
  if (timerAggiornamento) clearInterval(timerAggiornamento)
})
</script>

<template>
  <div class="vista-panoramica">
    <div class="intestazione-panoramica">
      <div>
        <h1 class="titolo-sezione">Panoramica Analytics</h1>
        <p class="sottotitolo">Monitoraggio globale del portfolio e dei siti collegati</p>
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

    <!-- Schede Metriche in alto -->
    <div class="griglia-metriche">
      <SchedaMetrica
        etichetta="Visite Totali"
        :valore="totaleVisite.toLocaleString('it-IT')"
        :sottotitolo="`Negli ultimi ${giorni} giorni`"
        evidenziato
      />
      <SchedaMetrica
        etichetta="Visitatori Unici"
        :valore="totaleUnici.toLocaleString('it-IT')"
        :sottotitolo="`Hash giornaliero a rotazione`"
      />
      <SchedaMetrica
        etichetta="Siti Censiti"
        :valore="sitiAttivi"
        sottotitolo="Monitorati attivamente"
      />
      <SchedaMetrica
        etichetta="Consumo Quota Ingest"
        :valore="stimaQuota"
        sottotitolo="Su 100k rich/giorno free"
      />
    </div>

    <!-- Tabella dei siti -->
    <div class="riquadro-tabella">
      <div class="testata-tabella">
        <h2>Siti Monitorati</h2>
        <span class="auto-refresh-badge">Auto-refresh (60s)</span>
      </div>

      <div v-if="caricamento && (!dati.siti || dati.siti.length === 0)" class="stato-caricamento">
        Caricamento dati dal cluster D1...
      </div>

      <div v-else class="tabella-wrapper">
        <table class="tabella-siti">
          <thead>
            <tr>
              <th style="width: 40px">Stato</th>
              <th>Sito</th>
              <th class="text-right">Visite</th>
              <th class="text-right">Unici</th>
              <th class="text-center" style="width: 120px">Trend</th>
              <th class="text-right" style="width: 100px">Azione</th>
            </tr>
          </thead>
          <tbody>
            <RigaSito
              v-for="s in dati.siti"
              :key="s.id"
              :sito="s"
              :trend="trendPerSito[s.id] || []"
            />
            <tr v-if="!dati.siti || dati.siti.length === 0">
              <td colspan="6" class="testo-vuoto">
                Nessun evento registrato per il periodo selezionato.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.vista-panoramica {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.intestazione-panoramica {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 1rem;
}

.titolo-sezione {
  font-size: 1.85rem;
  font-weight: 800;
  letter-spacing: -0.01em;
}

.sottotitolo {
  color: #64748b;
  font-size: 0.95rem;
}

@media (prefers-color-scheme: dark) {
  .sottotitolo {
    color: #94a3b8;
  }
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

@media (prefers-color-scheme: dark) {
  .avviso-errore {
    background: #450a0a;
    border-color: #7f1d1d;
    color: #fca5a5;
  }
}

.griglia-metriche {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.25rem;
}

.riquadro-tabella {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
}

@media (prefers-color-scheme: dark) {
  .riquadro-tabella {
    background: #1e293b;
    border-color: #334155;
  }
}

.testata-tabella {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

@media (prefers-color-scheme: dark) {
  .testata-tabella {
    border-bottom-color: #334155;
  }
}

.testata-tabella h2 {
  font-size: 1.15rem;
  font-weight: 700;
}

.auto-refresh-badge {
  font-size: 0.75rem;
  color: #64748b;
  background: #f1f5f9;
  padding: 0.2rem 0.6rem;
  border-radius: 9999px;
}

@media (prefers-color-scheme: dark) {
  .auto-refresh-badge {
    background: #0f172a;
    color: #94a3b8;
  }
}

.tabella-wrapper {
  overflow-x: auto;
}

.tabella-siti {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.9rem;
}

.tabella-siti th {
  padding: 0.75rem 0.75rem;
  font-size: 0.78rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #64748b;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

@media (prefers-color-scheme: dark) {
  .tabella-siti th {
    background: #0f172a;
    border-bottom-color: #334155;
    color: #94a3b8;
  }
}

.text-right {
  text-align: right;
}

.text-center {
  text-align: center;
}

.stato-caricamento {
  padding: 3rem;
  text-align: center;
  color: #64748b;
  font-size: 0.95rem;
}

.testo-vuoto {
  padding: 2.5rem;
  text-align: center;
  color: #94a3b8;
}
</style>
