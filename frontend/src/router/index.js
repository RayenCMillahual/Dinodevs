// frontend/src/router/index.js - VERSIÓN CORREGIDA
import { createRouter, createWebHistory } from 'vue-router';
import { useAuth0 } from '@auth0/auth0-vue';
import DinoHome from '@/views/DinoHome.vue';
import DinoJuegos from '@/views/DinoJuegos.vue';
import DinoInformacion from '@/views/DinoInformacion.vue';
import MemoryGame from '@/components/MemoryGame.vue';
import RegisterPrompt from '@/views/RegisterPrompt.vue';

// Función helper para verificar email
async function checkEmailVerification(user, getAccessTokenSilently) {
  try {
    // Primero verificar en el objeto user local
    if (user.value?.email_verified) {
      return true;
    }
    
    // Si no está verificado localmente, consultar al backend
    const token = await getAccessTokenSilently({ 
      cacheMode: 'off',
      ignoreCache: true 
    });
    
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/auth/check-verification`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.email_verified || false;
    }
    
    return false;
  } catch (error) {
    console.error('Error verificando email:', error);
    return false;
  }
}

// Guard para rutas protegidas que requieren autenticación y email verificado
async function requiresEmailVerification(to, from, next) {
  const { isAuthenticated, loginWithRedirect, user, getAccessTokenSilently } = useAuth0();
  
  try {
    // Si no está autenticado, redirigir al login
    if (!isAuthenticated.value) {
      await loginWithRedirect({ 
        appState: { target: to.fullPath },
        authorizationParams: {
          // CORRECCIÓN: usar window.location.origin en lugar de hardcodear
          redirect_uri: `${window.location.origin}/callback`
        }
      });
      return;
    }
    
    // Verificar si el email está verificado
    const emailVerified = await checkEmailVerification(user, getAccessTokenSilently);
    
    if (!emailVerified) {
      // Si el email no está verificado, redirigir a RegisterPrompt
      next('/register-prompt');
      return;
    }
    
    // Si todo está bien, permitir acceso
    next();
  } catch (error) {
    console.error('Error en guard de verificación:', error);
    // En caso de error, redirigir a RegisterPrompt por seguridad
    next('/register-prompt');
  }
}

// Guard solo para autenticación (sin verificar email)
async function requiresAuth(to, from, next) {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  
  if (!isAuthenticated.value) {
    await loginWithRedirect({ 
      appState: { target: to.fullPath },
      authorizationParams: {
        // CORRECCIÓN: usar window.location.origin
        redirect_uri: `${window.location.origin}/callback`
      }
    });
    return;
  }
  
  next();
}

const routes = [
  { 
    path: '/', 
    component: DinoHome,
    name: 'home'
  },
  
  // NUEVA RUTA: Callback de Auth0
  {
    path: '/callback',
    component: () => import('@/views/CallbackPage.vue'),
    name: 'callback'
  },
  
  {
    path: '/juegos',
    component: DinoJuegos,
    name: 'juegos',
    beforeEnter: requiresEmailVerification,
    meta: {
      requiresAuth: true,
      requiresEmailVerification: true,
      title: 'Juegos - DinosDevs'
    }
  },
  
  { 
    path: '/informacion', 
    component: DinoInformacion,
    name: 'informacion',
    meta: {
      title: 'Información - DinosDevs'
    }
  },
  
  {
    path: '/memory-game',
    component: MemoryGame,
    name: 'memory-game',
    beforeEnter: requiresEmailVerification,
    meta: {
      requiresAuth: true,
      requiresEmailVerification: true,
      title: 'Juego de Memoria - DinosDevs'
    }
  },
  
  { 
    path: '/register-prompt', 
    component: RegisterPrompt,
    name: 'register-prompt',
    beforeEnter: requiresAuth,
    meta: {
      requiresAuth: true,
      title: 'Verificar Email - DinosDevs'
    }
  },

  // Ruta catch-all para 404
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guard global para manejar títulos de página
router.afterEach((to) => {
  document.title = to.meta.title || 'DinosDevs - Explora el Mundo Jurásico';
});

// Guard global para debugging (opcional, remover en producción)
router.beforeEach((to, from, next) => {
  console.log(`Navegando de ${from.path} a ${to.path}`);
  next();
});

export default router;