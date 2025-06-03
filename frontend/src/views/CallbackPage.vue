<!-- frontend/src/views/CallbackPage.vue -->
<template>
  <div class="callback-container">
    <div class="callback-content">
      <div class="loading-spinner"></div>
      <h2>{{ loadingMessage }}</h2>
      <p>{{ subMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useAuth0 } from '@auth0/auth0-vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const { isAuthenticated, user, handleRedirectCallback } = useAuth0();

const loadingMessage = ref('Procesando autenticación...');
const subMessage = ref('Un momento por favor');

onMounted(async () => {
  try {
    // Manejar el callback de Auth0
    await handleRedirectCallback();
    
    // Esperar a que la autenticación se complete
    setTimeout(() => {
      if (isAuthenticated.value) {
        loadingMessage.value = '¡Autenticación exitosa!';
        
        // Verificar si el email está verificado
        if (user.value?.email_verified) {
          subMessage.value = 'Redirigiendo a juegos...';
          setTimeout(() => {
            router.push('/juegos');
          }, 1500);
        } else {
          subMessage.value = 'Redirigiendo para verificar email...';
          setTimeout(() => {
            router.push('/register-prompt');
          }, 1500);
        }
      } else {
        loadingMessage.value = 'Error en la autenticación';
        subMessage.value = 'Redirigiendo al inicio...';
        setTimeout(() => {
          router.push('/');
        }, 2000);
      }
    }, 1000);
    
  } catch (error) {
    console.error('Error en callback:', error);
    loadingMessage.value = 'Error en la autenticación';
    subMessage.value = 'Redirigiendo al inicio...';
    setTimeout(() => {
      router.push('/');
    }, 2000);
  }
});
</script>

<style scoped>
.callback-container {
  background: url('@/assets/fondoinicio.jpg') no-repeat center center;
  background-size: cover;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.callback-content {
  text-align: center;
  padding: 40px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 15px;
  color: #fff;
  max-width: 500px;
  width: 100%;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.loading-spinner {
  width: 60px;
  height: 60px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #4ade80;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: #4ade80;
}

p {
  font-size: 1rem;
  color: #e5e7eb;
  line-height: 1.5;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .callback-content {
    padding: 30px 20px;
  }
  
  h2 {
    font-size: 1.3rem;
  }
  
  p {
    font-size: 0.9rem;
  }
}
</style>