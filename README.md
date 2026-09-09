# ep-dashboard (Cloudflare Pages + Vue 3)

Gestionale privato di analisi traffico multi-sito, sviluppato in Vue 3 e Vite, progettato per essere servito staticamente da Cloudflare Pages e protetto tramite Cloudflare Access (Zero Trust).

## Caratteristiche
- **Zero dipendenze grafiche**: sparkline generate tramite polyline SVG pure calcolate a mano (`Sparkline.vue`).
- **Autenticazione senza codice**: interamente demandata a Cloudflare Access (Zero Trust). Il frontend effettua chiamate fetch con `credentials: 'include'` e intercetta HTTP 401/403 ricaricando la pagina verso l'SSO.
- **Raggruppamento client-side**: il backend invia dati aggregate in soli 2 query; il frontend raggruppa trend per sito senza chiamate N+1.
- **Monitoraggio stato live**: indicatore colorato (verde <1h, ambra >1h, grigio assenza dati) ricavato da `ultimo_evento` e aggiornamento automatico via `setInterval` ogni 60 secondi.

## Installazione e Avvio
```bash
# Installa le dipendenze
npm install

# Copia le variabili d'ambiente
cp .env.example .env.local

# Avvia il server di sviluppo
npm run dev

# Build di produzione per Cloudflare Pages
npm run build
```

## Deploy su Cloudflare Pages
- **Framework preset**: `Vite`
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Variabili d'ambiente**:
  - `VITE_API_URL`: `https://analytics.edoardopippi.dev`
- **Protezione Access**: Configura una Cloudflare Access Application sull'hostname del gestionale (es. `stats.edoardopippi.dev`) e sul path Worker `/api/*`.
