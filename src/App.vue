<script setup>
import { RouterView, RouterLink } from 'vue-router'
import { useTema } from './composables/useTema'

const { tema, toggleTema } = useTema()
</script>

<template>
  <div class="layout-dashboard">
    <header class="barra-navigazione">
      <div class="contenitore testata-flessibile">
        <div class="brand">
          <RouterLink to="/" class="brand-link">
            <span class="icona-brand">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
            </span>
            <span class="testo-brand">EP Analytics</span>
            <span class="badge-ruolo">Admin</span>
          </RouterLink>
        </div>

        <div class="accesso-info">
          <span class="access-badge">
            <span class="dot-sicurezza"></span>
            Cloudflare Access
          </span>

          <!-- Toggle Tema Dark / Light -->
          <button
            type="button"
            class="pulsante-tema"
            :aria-label="tema === 'dark' ? 'Passa al tema chiaro' : 'Passa al tema scuro'"
            :title="tema === 'dark' ? 'Tema attuale: Scuro. Clicca per Chiaro' : 'Tema attuale: Chiaro. Clicca per Scuro'"
            @click="toggleTema"
          >
            <span class="icona-involucro">
              <svg
                v-if="tema === 'dark'"
                xmlns="http://www.w3.org/2000/svg"
                class="icona-svg sole"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="12" cy="12" r="4"></circle>
                <path d="M12 2v2"></path>
                <path d="M12 20v2"></path>
                <path d="m4.93 4.93 1.41 1.41"></path>
                <path d="m17.66 17.66 1.41 1.41"></path>
                <path d="M2 12h2"></path>
                <path d="M20 12h2"></path>
                <path d="m6.34 17.66-1.41 1.41"></path>
                <path d="m19.07 4.93-1.41 1.41"></path>
              </svg>
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                class="icona-svg luna"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
              </svg>
            </span>
            <span class="testo-tema">{{ tema === 'dark' ? 'Chiaro' : 'Scuro' }}</span>
          </button>
        </div>
      </div>
    </header>

    <main class="contenitore contenuto-principale">
      <RouterView />
    </main>

    <footer class="footer-dashboard">
      <div class="contenitore footer-flessibile">
        <span>&copy; {{ new Date().getFullYear() }} EP Analytics Dashboard &bull; Multi-site Private Engine</span>
        <div class="link-footer">
          <a href="https://github.com/MCR300400/ep-dashboard" target="_blank" rel="noopener noreferrer">GitHub</a>
          <span>&bull;</span>
          <a href="https://edoardopippi.dev" target="_blank" rel="noopener noreferrer">Portfolio</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<style>
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  background-color: var(--bg-primario);
  color: var(--testo-primario);
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  transition: background-color 0.25s ease, color 0.2s ease;
}

.contenitore {
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.layout-dashboard {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.barra-navigazione {
  position: sticky;
  top: 0;
  z-index: 40;
  background: var(--header-bg);
  border-bottom: 1px solid var(--bordo-sottile);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  padding: 0.85rem 0;
  transition: background-color 0.25s ease, border-color 0.25s ease;
}

.testata-flessibile {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.brand-link {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  text-decoration: none;
  color: var(--testo-primario);
  font-weight: 750;
  font-size: 1.12rem;
  letter-spacing: -0.015em;
}

.icona-brand {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 8px;
  background: linear-gradient(135deg, var(--accento), #ea580c);
  color: #ffffff;
  box-shadow: 0 2px 10px var(--accento-sfondo-hover);
}

.badge-ruolo {
  background: var(--accento-sfondo);
  color: var(--accento);
  border: 1px solid var(--accento-bordo);
  font-size: 0.68rem;
  font-weight: 750;
  padding: 0.15rem 0.45rem;
  border-radius: 5px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.accesso-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.access-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #10b981;
  background: rgba(16, 185, 129, 0.08);
  border: 1px solid rgba(16, 185, 129, 0.25);
  padding: 0.3rem 0.65rem;
  border-radius: 9999px;
}

.dot-sicurezza {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #10b981;
  box-shadow: 0 0 6px rgba(16, 185, 129, 0.6);
}

.pulsante-tema {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  height: 2.15rem;
  padding: 0 0.8rem;
  border-radius: 8px;
  border: 1px solid var(--bordo-medio);
  background: var(--bg-superficie);
  color: var(--testo-secondario);
  cursor: pointer;
  font-family: inherit;
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  transition: all 0.18s ease;
  user-select: none;
}

.pulsante-tema:hover {
  color: var(--accento);
  border-color: var(--accento-bordo);
  background: var(--bg-superficie-elevata);
}

.icona-involucro {
  display: flex;
  align-items: center;
  justify-content: center;
}

.icona-svg {
  width: 15px;
  height: 15px;
  transition: transform 0.25s ease;
}

.pulsante-tema:hover .icona-svg.sole {
  transform: rotate(45deg);
}

.pulsante-tema:hover .icona-svg.luna {
  transform: rotate(-15deg);
}

.contenuto-principale {
  flex: 1;
  padding-top: 2rem;
  padding-bottom: 3.5rem;
}

.footer-dashboard {
  border-top: 1px solid var(--bordo-sottile);
  background: var(--bg-superficie);
  padding: 1.5rem 0;
  font-size: 0.82rem;
  color: var(--testo-terziario);
  margin-top: auto;
}

.footer-flessibile {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.link-footer {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.link-footer a {
  color: var(--testo-secondario);
  text-decoration: none;
  font-weight: 550;
  transition: color 0.15s ease;
}

.link-footer a:hover {
  color: var(--accento);
}

@media (max-width: 640px) {
  .access-badge {
    display: none;
  }
}
</style>
