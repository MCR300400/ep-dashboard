import { ref, computed } from 'vue'

const LINGUA_KEY = 'ep_lingua'

function ottieniLinguaIniziale() {
  if (typeof window === 'undefined') return 'it'
  try {
    const salvata = localStorage.getItem(LINGUA_KEY)
    if (salvata === 'it' || salvata === 'en') return salvata
    const browserLang = navigator.language || navigator.userLanguage || ''
    if (browserLang.startsWith('it')) return 'it'
    return 'it'
  } catch (e) {
    console.debug('Impossibile accedere a localStorage per la lingua:', e)
    return 'it'
  }
}

const lingua = ref(ottieniLinguaIniziale())

export function useLingua() {
  const isItalian = computed(() => lingua.value === 'it')
  const isEnglish = computed(() => lingua.value === 'en')

  function applicaLingua(nuovaLingua) {
    lingua.value = nuovaLingua
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('lang', nuovaLingua)
      try {
        localStorage.setItem(LINGUA_KEY, nuovaLingua)
      } catch (e) {
        console.warn('Impossibile salvare la lingua in localStorage:', e)
      }
    }
  }

  function toggleLingua() {
    applicaLingua(lingua.value === 'it' ? 'en' : 'it')
  }

  function t(valore) {
    if (!valore) return ''
    if (typeof valore === 'object') {
      return valore[lingua.value] || valore.it || ''
    }
    return dizionario[valore]?.[lingua.value] || valore
  }

  return {
    lingua,
    isItalian,
    isEnglish,
    setLingua: applicaLingua,
    toggleLingua,
    t
  }
}

export const dizionario = {
  // Navigazione & Layout
  'nav.admin': { it: 'Admin', en: 'Admin' },
  'nav.temaChiaro': { it: 'Chiaro', en: 'Light' },
  'nav.temaScuro': { it: 'Scuro', en: 'Dark' },
  'nav.footer': {
    it: 'EP Analytics Dashboard • Motore privato multi-sito',
    en: 'EP Analytics Dashboard • Multi-site Private Engine'
  },

  // Panoramica
  'panoramica.titolo': { it: 'Panoramica Analytics', en: 'Analytics Overview' },
  'panoramica.sottotitolo': {
    it: 'Monitoraggio globale del portfolio e dei siti collegati',
    en: 'Global monitoring of portfolio and connected projects'
  },
  'periodo.ultimi': { it: 'Ultimi', en: 'Last' },
  'periodo.giorni': { it: 'giorni', en: 'days' },

  // Schede Metriche
  'metrica.visiteTotali': { it: 'Visite Totali', en: 'Total Pageviews' },
  'metrica.visiteSotto': { it: 'Negli ultimi {n} giorni', en: 'In the last {n} days' },
  'metrica.unici': { it: 'Visitatori Unici', en: 'Unique Visitors' },
  'metrica.uniciSotto': { it: 'Hash visitatore su D1', en: 'Visitor hash on D1' },
  'metrica.sitiCensiti': { it: 'Siti Censiti', en: 'Monitored Sites' },
  'metrica.sitiCensitiSotto': { it: 'Monitorati attivamente', en: 'Actively tracked' },
  'metrica.consumoQuota': { it: 'Consumo Quota Ingest', en: 'Ingest Quota Usage' },
  'metrica.consumoQuotaSotto': { it: 'Su 100k rich/giorno free', en: 'Out of 100k free req/day' },

  // Tabella Siti
  'tabella.titolo': { it: 'Siti Monitorati', en: 'Monitored Sites' },
  'tabella.badge': { it: 'siti', en: 'sites' },
  'tabella.stato': { it: 'Stato', en: 'Status' },
  'tabella.sito': { it: 'Sito', en: 'Site' },
  'tabella.visite': { it: 'Visite', en: 'Views' },
  'tabella.unici': { it: 'Unici', en: 'Uniques' },
  'tabella.trend': { it: 'Trend', en: 'Trend' },
  'tabella.azione': { it: 'Azione', en: 'Action' },
  'tabella.dettagli': { it: 'Dettagli', en: 'Details' },
  'tabella.nessunEvento': {
    it: 'Nessun evento registrato per il periodo selezionato.',
    en: 'No events recorded for the selected period.'
  },
  'tabella.caricamento': {
    it: 'Caricamento dati dal cluster D1...',
    en: 'Loading data from D1 cluster...'
  },

  // Auto-refresh
  'refresh.inPausa': { it: 'In pausa', en: 'Paused' },
  'refresh.aggiornamento': { it: 'Aggiornamento...', en: 'Updating...' },
  'refresh.autoIn': { it: 'Auto-refresh in', en: 'Auto-refresh in' },
  'refresh.aggiorna': { it: 'Aggiorna', en: 'Refresh' },
  'refresh.riprendi': { it: 'Riprendi auto-refresh', en: 'Resume auto-refresh' },
  'refresh.pausa': { it: 'Metti in pausa auto-refresh', en: 'Pause auto-refresh' },

  // Dettaglio Sito
  'dettaglio.ritorno': { it: 'Torna alla Panoramica', en: 'Back to Overview' },
  'dettaglio.sito': { it: 'Sito:', en: 'Site:' },
  'dettaglio.durataMediana': { it: 'Durata Mediana', en: 'Median Duration' },
  'dettaglio.durataSotto': { it: 'Calcolata da sessioni reali', en: 'Calculated from live sessions' },
  'dettaglio.pagineVisitate': { it: 'Visualizzazioni Pagine', en: 'Page Views' },
  'dettaglio.pagineSotto': { it: 'Top percorsi negli ultimi {n} gg', en: 'Top routes in last {n} days' },
  'dettaglio.referrerUnici': { it: 'Fonti Referrer Uniche', en: 'Unique Referrer Sources' },
  'dettaglio.referrerSotto': { it: 'Domini esterni tracciati', en: 'Tracked external domains' },
  'dettaglio.topPagine': { it: 'Pagine più visitate', en: 'Most Visited Pages' },
  'dettaglio.topReferrer': { it: 'Sorgenti di traffico (Referrer)', en: 'Traffic Sources (Referrers)' },
  'dettaglio.caricamentoPercorsi': { it: 'Caricamento percorsi...', en: 'Loading routes...' },
  'dettaglio.caricamentoSorgenti': { it: 'Caricamento sorgenti...', en: 'Loading sources...' },
  'dettaglio.nessunPercorso': { it: 'Nessuna visualizzazione registrata per questo periodo.', en: 'No page views recorded for this period.' },
  'dettaglio.nessunReferrer': { it: 'Nessun referrer registrato per questo periodo.', en: 'No referrers recorded for this period.' },
  'dettaglio.diretto': { it: 'Diretto / Segnalibri', en: 'Direct / Bookmarks' }
}
