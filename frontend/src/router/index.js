import { createRouter, createWebHistory } from 'vue-router';
import { useAuth0 } from '@auth0/auth0-vue';
import DinoHome from '@/views/DinoHome.vue';
import DinoMenu from '@/views/DinoMenu.vue';
import DinoJuegos from '@/views/DinoJuegos.vue';
import DinoInformacion from '@/views/DinoInformacion.vue';
import RealidadAumentada from '@/views/RealidadAumentada.vue';
import MemoryGame from '@/components/MemoryGame.vue';
import SopaDeLetras from '@/components/SopaDeLetras.vue';
import RegisterPrompt from '@/views/RegisterPrompt.vue';
import ProtectedView from '@/views/ProtectedView.vue';

const routes = [
  { path: '/', component: DinoHome },
  { path: '/menu', component: DinoMenu },
  {
    path: '/juegos',
    component: DinoJuegos,
    beforeEnter: async (to, from, next) => {
      const { isAuthenticated, loginWithRedirect } = useAuth0();
      if (!isAuthenticated.value) {
        await loginWithRedirect({ appState: { target: to.fullPath } });
      } else next();
    },
  },
  { path: '/informacion', component: DinoInformacion },
  { path: '/realidad-aumentada', component: RealidadAumentada },
  { path: '/memory-game', component: MemoryGame },
  { path: '/sopa-de-letras', component: SopaDeLetras },
  { path: '/register-prompt', component: RegisterPrompt },
  {
    path: '/protected',
    component: ProtectedView,
    beforeEnter: async (to, from, next) => {
      const { isAuthenticated, loginWithRedirect } = useAuth0();
      if (!isAuthenticated.value) {
        await loginWithRedirect({ appState: { target: to.fullPath } });
      } else next();
    },
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});