const BASE = import.meta.env.VITE_API_URL || ''

async function chiama(percorso) {
  const res = await fetch(`${BASE}${percorso}`, { credentials: 'include' })
  if (res.status === 401 || res.status === 403) {
    // Sessione Cloudflare Access scaduta o non autorizzata:
    // ricarica la pagina per avviare il flusso di autenticazione SSO
    window.location.reload()
    return null
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export const getPanoramica = (g = 7) => chiama(`/api/panoramica?giorni=${g}`)
export const getDettaglio = (id, g = 7) => chiama(`/api/siti/${id}?giorni=${g}`)
