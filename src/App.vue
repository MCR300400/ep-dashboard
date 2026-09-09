<script setup>
import { RouterView, RouterLink } from 'vue-router'
</script>

<template>
  <div class="layout-dashboard">
    <header class="barra-navigazione">
      <div class="contenitore testata-flessibile">
        <div class="brand">
          <RouterLink to="/" class="brand-link">
            <span class="icona-brand">⚡</span>
            <span class="testo-brand">EP Analytics</span>
            <span class="badge-ruolo">Admin</span>
          </RouterLink>
        </div>

        <div class="accesso-info">
          <span class="access-badge">Protetto da Cloudflare Access</span>
        </div>
      </div>
    </header>

    <main class="contenitore contenuto-principale">
      <RouterView />
    </main>

    <footer class="footer-dashboard">
      <div class="contenitore footer-flessibile">
        <span>EP Analytics Dashboard &bull; Multi-site Private Engine</span>
        <span>Cloudflare Zero Trust & D1</span>
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
  background-color: #f1f5f9;
  color: #0f172a;
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
}

@media (prefers-color-scheme: dark) {
  body {
    background-color: #0b0f19;
    color: #f8fafc;
  }
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
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  padding: 0.9rem 0;
}

@media (prefers-color-scheme: dark) {
  .barra-navigazione {
    background: #111827;
    border-bottom-color: #1f2937;
  }
}

.testata-flessibile {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: inherit;
  font-weight: 700;
  font-size: 1.15rem;
}

.badge-ruolo {
  background: #2563eb;
  color: #ffffff;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.access-badge {
  font-size: 0.75rem;
  color: #059669;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  padding: 0.25rem 0.6rem;
  border-radius: 9999px;
  font-weight: 500;
}

@media (prefers-color-scheme: dark) {
  .access-badge {
    background: #064e3b;
    border-color: #047857;
    color: #6ee7b7;
  }
}

.contenuto-principale {
  flex: 1;
  padding-top: 2rem;
  padding-bottom: 3rem;
}

.footer-dashboard {
  border-top: 1px solid #e2e8f0;
  background: #ffffff;
  padding: 1.25rem 0;
  font-size: 0.8rem;
  color: #64748b;
}

@media (prefers-color-scheme: dark) {
  .footer-dashboard {
    background: #111827;
    border-top-color: #1f2937;
    color: #94a3b8;
  }
}

.footer-flessibile {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}
</style>
