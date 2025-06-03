<template>
  <div class="container">
    <div class="register-prompt">
      <!-- Mensaje para usuarios no autenticados -->
      <template v-if="!isAuthenticated">
        <h2>¡Debes iniciar sesión para jugar!</h2>
        <p>Regístrate o inicia sesión para acceder a la sección de juegos</p>
        <div class="button-container">
<button @click="loginWithRedirect({ authorizationParams: { redirect_uri: 'http://localhost:3000/juegos' } })" class="btn-estilos">
  Iniciar Sesión
</button>
<button @click="loginWithRedirect({ authorizationParams: { screen_hint: 'signup', redirect_uri: 'http://localhost:3000/juegos' } })" class="btn-estilos bg-green-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-700">
  Registrarse
</button>
        </div>
      </template>

      <!-- Mensaje para usuarios autenticados pero sin verificar email -->
      <template v-else-if="isAuthenticated && !isEmailVerified">
        <div class="email-verification-prompt">
          <div class="verification-icon">
            <i class="fas fa-envelope-open-text"></i>
          </div>
          <h2>¡Verifica tu email para continuar!</h2>
          <p>Hemos enviado un email de verificación a <strong>{{ userEmail }}</strong></p>
          <p class="verification-text">
            Por favor, revisa tu bandeja de entrada y haz clic en el enlace de verificación para acceder a los juegos.
          </p>
          
          <div class="verification-steps">
            <div class="step">
              <i class="fas fa-envelope"></i>
              <span>Revisa tu email</span>
            </div>
            <div class="step">
              <i class="fas fa-mouse-pointer"></i>
              <span>Haz clic en el enlace</span>
            </div>
            <div class="step">
              <i class="fas fa-gamepad"></i>
              <span>¡Juega!</span>
            </div>
          </div>

          <!-- Mensaje de éxito/error -->
          <div v-if="message" class="message" :class="messageType">
            <i :class="messageType === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'"></i>
            {{ message }}
          </div>

          <div class="button-container">
            <button @click="handleResendEmail" class="btn-estilos btn-resend" :disabled="isResending">
              <i class="fas fa-paper-plane" :class="{ 'fa-spin': isResending }"></i>
              {{ isResending ? 'Enviando...' : 'Reenviar email' }}
            </button>
            <button @click="handleCheckVerification" class="btn-estilos btn-check" :disabled="isChecking">
              <i class="fas fa-sync-alt" :class="{ 'fa-spin': isChecking }"></i>
              {{ isChecking ? 'Verificando...' : 'Ya verifiqué mi email' }}
            </button>
            <button @click="handleLogout" class="btn-estilos btn-logout">
              <i class="fas fa-sign-out-alt"></i>
              Cerrar sesión
            </button>
          </div>

          <div class="help-text">
            <p><small>¿No recibes el email? Revisa tu carpeta de spam o correo no deseado.</small></p>
          </div>
        </div>
      </template>

      <!-- Mensaje de carga mientras se verifica el estado -->
      <template v-else-if="isLoading">
        <div class="loading-state">
          <div class="loading-spinner"></div>
          <h2>Verificando tu cuenta...</h2>
          <p>Un momento por favor</p>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { useAuth0 } from '@auth0/auth0-vue';
import { computed, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useEmailVerification } from '@/composables/useEmailVerification';

const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();
const router = useRouter();

// Usar el composable de verificación de email
const {
  isEmailVerified,
  userEmail,
  isChecking,
  isResending,
  resendVerificationEmail,
  checkEmailVerificationStatus
} = useEmailVerification();

// Estados reactivos locales
const isLoading = ref(true);
const message = ref('');
const messageType = ref('');

// Verificar el estado del usuario al montar el componente
onMounted(async () => {
  // Esperar un momento para que Auth0 cargue completamente
  setTimeout(() => {
    isLoading.value = false;
    
    // Si el usuario está autenticado y su email está verificado, redirigir a juegos
    if (isAuthenticated.value && isEmailVerified.value) {
      router.push('/juegos');
    }
  }, 1000);
});

// Función para reenviar email de verificación
async function handleResendEmail() {
  try {
    clearMessage();
    const result = await resendVerificationEmail();
    
    if (result.success) {
      showMessage(result.message, 'success');
    }
  } catch (error) {
    console.error('Error reenviando email:', error);
    showMessage(error.message || 'Hubo un error al reenviar el email. Inténtalo más tarde.', 'error');
  }
}

// Función para verificar si el email ya fue verificado
async function handleCheckVerification() {
  try {
    clearMessage();
    const isVerified = await checkEmailVerificationStatus();
    
    if (isVerified) {
      showMessage('¡Email verificado correctamente! Redirigiendo...', 'success');
      setTimeout(() => {
        router.push('/juegos');
      }, 2000);
    } else {
      showMessage('El email aún no está verificado. Revisa tu bandeja de entrada.', 'error');
    }
  } catch (error) {
    console.error('Error verificando email:', error);
    showMessage('Hubo un error al verificar tu email. Inténtalo más tarde.', 'error');
  }
}

// Función para cerrar sesión
async function handleLogout() {
  try {
    await logout({ 
      logoutParams: {
        returnTo: 'http://localhost:3000'
      }
    });
  } catch (error) {
    console.error('Error durante logout:', error);
    window.location.href = 'http://localhost:3000';
  }
}

// Funciones para manejar mensajes
function showMessage(text, type) {
  message.value = text;
  messageType.value = type;
  
  // Limpiar el mensaje después de 5 segundos si es de éxito
  if (type === 'success') {
    setTimeout(() => {
      clearMessage();
    }, 5000);
  }
}

function clearMessage() {
  message.value = '';
  messageType.value = '';
}
</script>

<style scoped>
.container {
  background: url('https://media.giphy.com/media/mTrUbEjM1Agta/giphy.gif') no-repeat center center;
  background-size: cover;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.register-prompt {
  text-align: center;
  padding: 30px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  color: #fff;
  max-width: 500px;
  width: 100%;
  backdrop-filter: blur(5px);
}

.email-verification-prompt {
  animation: fadeIn 0.5s ease-in;
}

.verification-icon {
  font-size: 3rem;
  color: #4ade80;
  margin-bottom: 1rem;
}

.verification-icon i {
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

.verification-text {
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 1.5rem;
  color: #e5e7eb;
}

.verification-steps {
  display: flex;
  justify-content: space-around;
  margin: 2rem 0;
  flex-wrap: wrap;
  gap: 1rem;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  min-width: 100px;
}

.step i {
  font-size: 1.5rem;
  color: #4ade80;
  margin-bottom: 0.5rem;
}

.step span {
  font-size: 0.9rem;
  color: #d1d5db;
}

.message {
  padding: 12px;
  border-radius: 8px;
  margin: 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

.message.success {
  background-color: rgba(34, 197, 94, 0.2);
  border: 1px solid #22c55e;
  color: #86efac;
}

.message.error {
  background-color: rgba(239, 68, 68, 0.2);
  border: 1px solid #ef4444;
  color: #fca5a5;
}

.button-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn-estilos {
  background-color: #155335;
  color: #fff;
  border: none;
  padding: 12px 24px;
  font-size: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-estilos:hover {
  background-color: #225c22;
  transform: translateY(-2px);
}

.btn-estilos:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-resend {
  background-color: #2563eb;
}

.btn-resend:hover:not(:disabled) {
  background-color: #1d4ed8;
}

.btn-check {
  background-color: #059669;
}

.btn-check:hover:not(:disabled) {
  background-color: #047857;
}

.btn-logout {
  background-color: #dc2626;
}

.btn-logout:hover {
  background-color: #b91c1c;
}

.help-text {
  margin-top: 1.5rem;
  color: #9ca3af;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #4ade80;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.fa-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Responsive design */
@media (max-width: 768px) {
  .container {
    padding: 0.5rem;
  }
  
  .register-prompt {
    padding: 20px;
  }
  
  .verification-steps {
    flex-direction: column;
    align-items: center;
  }
  
  .step {
    flex-direction: row;
    justify-content: center;
    width: 100%;
    max-width: 200px;
  }
  
  .step i {
    margin-right: 0.5rem;
    margin-bottom: 0;
  }
}

@media (max-width: 480px) {
  .register-prompt {
    padding: 15px;
  }
  
  .verification-icon {
    font-size: 2.5rem;
  }
  
  .btn-estilos {
    padding: 10px 20px;
    font-size: 0.9rem;
  }
}
</style>