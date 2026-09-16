# ep-dashboard ⚡

> Gestionale privato di monitoraggio e analisi traffico multi-sito, sviluppato in **Vue 3** e **Vite**, servito ad alte prestazioni su **Cloudflare Pages** e protetto da **Cloudflare Access (Zero Trust)**.

[![Live App](https://img.shields.io/badge/Live%20App-ep--dashboard.pages.dev-f97316?style=flat&logo=cloudflare)](https://ep-dashboard.pages.dev)
[![GitHub](https://img.shields.io/badge/GitHub-MCR300400%2Fep--dashboard-181717?style=flat&logo=github)](https://github.com/MCR300400/ep-dashboard)
[![Backend Analytics](https://img.shields.io/badge/Backend-ep--analytics-orange?style=flat&logo=cloudflare)](https://ep-analytics.edoardopippi00.workers.dev)

---

## 🚀 Caratteristiche Principali

- 🎨 **Design System Unificato**: Palette Grafite (`#121316`) con accento arancione artigianale (`#f97316` / `#ea580c`), perfettamente allineato a `ep-portfolio`, `ep-algorithms`, `ep-drop` ed `ep-board`. Supporto tema Dark e Light con switch istantaneo e prevenzione del FOUC.
- ⏱️ **Auto-refresh con Timer Reale**: Conto alla rovescia in tempo reale (60s) con pulsante Pausa / Riprendi e refresh manuale istantaneo senza ricaricare l'intera pagina.
- 🔘 **Pulsante "Dettagli &rarr;" Ottimizzato**: Pulsante compatto a riga singola con transizione fluida all'hover e micro-interazione sulla freccia.
- 📈 **Zero Dipendenze Grafiche Esterne**: Sparkline SVG pure calcolate a mano (`Sparkline.vue`) per mostrare i trend di traffico senza librerie pesanti.
- 🔒 **Protezione Cloudflare Access (Zero Trust)**: Gestione trasparente dell'autenticazione tramite cookie di sessione sicuri e reindirizzamento automatico all'SSO su HTTP 401/403.
- ⚡ **Raggruppamento Client-side**: Aggregazioni aggregate in 2 sole query su D1, raggruppamento istantaneo per sito senza chiamate N+1.

---

## 🛠️ Stack Tecnologico

- **Frontend**: [Vue 3](https://vuejs.org/) + [Vite](https://vite.dev/) + [Vue Router](https://router.vuejs.org/)
- **Hosting**: [Cloudflare Pages](https://pages.cloudflare.com/) (Edge globale a bassissima latenza)
- **Database & API**: Cloudflare Worker con SQLite Cloudflare D1 (`ep-analytics`).

---

## 💻 Installazione e Sviluppo Locale

```bash
# Clona il repository
git clone https://github.com/MCR300400/ep-dashboard.git
cd ep-dashboard

# Installa le dipendenze
npm install

# Avvia il server di sviluppo
npm run dev

# Compila per la produzione
npm run build
```

---

## 🌐 Deploy su Cloudflare Pages

```bash
# Compilazione asset statici
npm run build

# Deploy su Cloudflare Pages
npx wrangler pages deploy dist --project-name=ep-dashboard
```

---

## 👤 Autore

**Edoardo Pippi**
- Portfolio: [edoardopippi.dev](https://edoardopippi.dev)
- GitHub: [@MCR300400](https://github.com/MCR300400)
