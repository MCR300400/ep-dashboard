import { createRouter, createWebHistory } from 'vue-router'
import Panoramica from './viste/Panoramica.vue'
import DettaglioSito from './viste/DettaglioSito.vue'

const routes = [
  { path: '/', name: 'Panoramica', component: Panoramica },
  { path: '/siti/:id', name: 'DettaglioSito', component: DettaglioSito, props: true }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
