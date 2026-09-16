<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { getPanoramica } from '../api'
import SchedaMetrica from '../components/SchedaMetrica.vue'
import RigaSito from '../components/RigaSito.vue'

const giorni = ref(7)
const caricamento = ref(true)
const aggiornamentoInCorso = ref(false)
const errore = ref(null)
const dati = ref({ siti: [], trend: [] })

// Timer Auto-refresh
const INTERVALLO_DEFAULT = 60
const intervalloSecondi = ref(INTERVALLO_DEFAULT)
const secondiRimanenti = ref(INTERVALLO_DEFAULT)
const inPausa = ref(false)
let timerCountdown = null

async function caricaDati(silenzioso = false) {
  if (silenzioso) {
    aggiornamentoInCorso.value = true
  } else {
    caricamento.value = true
  }
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
    aggiornamentoInCorso.value = false
    secondiRimanenti.value = intervalloSecondi.value
  }
}

function togglePausa() {
  inPausa.value = !inPausa.value
}

function avviaTimer() {
  if (timerCountdown) clearInterval(timerCountdown)
  timerCountdown = setInterval(() => {
    if (!inPausa.value && !caricamento.value && !aggiornamentoInCorso.value) {
      if (secondiRimanenti.value > 1) {
        secondiRimanenti.value--
      } else {
        secondiRimanenti.value = intervalloSecondi.value
        caricaDati(true)
      }
    }
  }, 1000)
}

function aggiornaManualmente() {
  caricaDati(true)
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
  secondiRimanenti.value = intervalloSecondi.value
  caricaDati(false)
})

onMounted(() => {
  caricaDati(false)
  avviaTimer()
})

onUnmounted(() => {
  if (timerCountdown) clearInterval(timerCountdown)
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
        :sottotitolo="`Hash visitatore su D1`"
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

    <!-- Tabella dei siti con widget Auto-refresh Timer -->
    <div class="riquadro-tabella">
      <div class="testata-tabella">
        <div class="titolo-tabella-gruppo">
          <h2>Siti Monitorati</h2>
          <span class="badge-conteggio">{{ (dati.siti || []).length }} siti</span>
        </div>

        <!-- Timer Auto-refresh Interattivo -->
        <div class="box-timer-refresh">
          <div
            class="pillola-timer"
            :class="{ inattivo: inPausa, aggiornando: aggiornamentoInCorso }"
            :title="inPausa ? 'Auto-refresh in pausa' : `Prossimo refresh automatico tra ${secondiRimanenti} secondi`"
          >
            <span class="dot-timer" :class="{ pausa: inPausa, pulse: !inPausa && !aggiornamentoInCorso }"></span>
            <span class="testo-timer">
              {{ inPausa ? 'In pausa' : (aggiornamentoInCorso ? 'Aggiornamento...' : `Auto-refresh in ${secondiRimanenti}s`) }}
            </span>
          </div>

          <!-- Pulsante Pausa / Riprendi -->
          <button
            type="button"
            class="btn-timer-azione"
            :title="inPausa ? 'Riprendi auto-refresh' : 'Metti in pausa auto-refresh'"
            @click="togglePausa"
          >
            <svg v-if="!inPausa" width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1"></rect>
              <rect x="14" y="4" width="4" height="16" rx="1"></rect>
            </svg>
            <svg v-else width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          </button>

          <!-- Pulsante Aggiorna Ora -->
          <button
            type="button"
            class="btn-timer-azione btn-aggiorna"
            :disabled="aggiornamentoInCorso"
            title="Aggiorna dati adesso"
            @click="aggiornaManualmente"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.3"
              stroke-linecap="round"
              stroke-linejoin="round"
              :class="{ 'animazione-rotazione': aggiornamentoInCorso }"
            >
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
            </svg>
            <span class="testo-btn-aggiorna">Aggiorna</span>
          </button>
        </div>
      </div>

      <div v-if="caricamento && (!dati.siti || dati.siti.length === 0)" class="stato-caricamento">
        <div class="loader-cerchio"></div>
        <p>Caricamento dati dal cluster D1...</p>
      </div>

      <div v-else class="tabella-wrapper">
        <table class="tabella-siti">
          <thead>
            <tr>
              <th style="width: 44px">Stato</th>
              <th>Sito</th>
              <th class="text-right">Visite</th>
              <th class="text-right">Unici</th>
              <th class="text-center" style="width: 120px">Trend</th>
              <th class="text-right colonna-azione-head">Azione</th>
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
  gap: 1.25rem;
}

.titolo-sezione {
  font-size: 2rem;
  font-weight: 850;
  letter-spacing: -0.025em;
  color: var(--testo-primario);
  margin-bottom: 0.35rem;
}

.sottotitolo {
  color: var(--testo-secondario);
  font-size: 0.95rem;
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

/* Riquadro Tabella */
.riquadro-tabella {
  background: var(--bg-superficie);
  border: 1px solid var(--bordo-medio);
  border-radius: 14px;
  box-shadow: var(--ombra-scheda);
  overflow: hidden;
}

.testata-tabella {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.15rem 1.5rem;
  border-bottom: 1px solid var(--bordo-sottile);
  flex-wrap: wrap;
  gap: 0.85rem;
}

.titolo-tabella-gruppo {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.titolo-tabella-gruppo h2 {
  font-size: 1.15rem;
  font-weight: 750;
  color: var(--testo-primario);
  letter-spacing: -0.01em;
}

.badge-conteggio {
  font-size: 0.75rem;
  font-weight: 650;
  color: var(--testo-terziario);
  background: var(--bg-superficie-elevata);
  padding: 0.18rem 0.5rem;
  border-radius: 6px;
  border: 1px solid var(--bordo-sottile);
}

/* Widget Timer Auto-refresh */
.box-timer-refresh {
  display: flex;
  align-items: center;
  gap: 0.45rem;
}

.pillola-timer {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.78rem;
  font-weight: 650;
  color: var(--testo-secondario);
  background: var(--bg-superficie-elevata);
  border: 1px solid var(--bordo-sottile);
  padding: 0.35rem 0.75rem;
  border-radius: 9999px;
  user-select: none;
}

.pillola-timer.aggiornando {
  border-color: var(--accento-bordo);
  color: var(--accento);
}

.pillola-timer.inattivo {
  color: var(--testo-terziario);
}

.dot-timer {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background-color: #10b981;
}

.dot-timer.pulse {
  box-shadow: 0 0 0 rgba(16, 185, 129, 0.4);
  animation: pulse-dot 2s infinite;
}

.dot-timer.pausa {
  background-color: var(--testo-terziario);
}

@keyframes pulse-dot {
  0% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.5);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(16, 185, 129, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
  }
}

.btn-timer-azione {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  height: 2rem;
  padding: 0 0.65rem;
  background: var(--bg-superficie-elevata);
  border: 1px solid var(--bordo-sottile);
  border-radius: 8px;
  color: var(--testo-secondario);
  cursor: pointer;
  font-size: 0.78rem;
  font-weight: 650;
  transition: all 0.15s ease;
}

.btn-timer-azione:hover {
  color: var(--accento);
  border-color: var(--accento-bordo);
  background: var(--bg-superficie-hover);
}

.btn-timer-azione:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-aggiorna {
  padding: 0 0.75rem;
}

.animazione-rotazione {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Tabella */
.tabella-wrapper {
  overflow-x: auto;
}

.tabella-siti {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.92rem;
}

.tabella-siti th {
  padding: 0.85rem 0.85rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--testo-terziario);
  background: var(--bg-superficie-elevata);
  border-bottom: 1px solid var(--bordo-sottile);
}

.colonna-azione-head {
  width: 130px;
  min-width: 130px;
  white-space: nowrap;
}

.text-right {
  text-align: right;
}

.text-center {
  text-align: center;
}

.stato-caricamento {
  padding: 3.5rem 1.5rem;
  text-align: center;
  color: var(--testo-terziario);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.85rem;
}

.loader-cerchio {
  width: 26px;
  height: 26px;
  border: 3px solid var(--bordo-medio);
  border-top-color: var(--accento);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.testo-vuoto {
  padding: 3rem;
  text-align: center;
  color: var(--testo-terziario);
  font-style: italic;
}

@media (max-width: 640px) {
  .testata-tabella {
    flex-direction: column;
    align-items: flex-start;
  }
  .box-timer-refresh {
    width: 100%;
    justify-content: space-between;
  }
  .testo-btn-aggiorna {
    display: none;
  }
}
</style>
