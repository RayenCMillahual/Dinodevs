// composables/useEmailVerification.js
import { ref, computed } from 'vue';
import { useAuth0 } from '@auth0/auth0-vue';

export function useEmailVerification() {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  
  const isChecking = ref(false);
  const lastCheckTime = ref(null);
  const isResending = ref(false);
  
  // Computed para verificar si el email está verificado
  const isEmailVerified = computed(() => {
    return user.value?.email_verified || false;
  });
  
  // Computed para obtener el email del usuario
  const userEmail = computed(() => {
    return user.value?.email || '';
  });
  
  // Función para verificar si se requiere verificación de email
  const requiresEmailVerification = computed(() => {
    return isAuthenticated.value && !isEmailVerified.value;
  });
  
  // Función para reenviar email de verificación
  async function resendVerificationEmail() {
    if (!isAuthenticated.value || !user.value || isResending.value) {
      throw new Error('Usuario no autenticado o solicitud en proceso');
    }
    
    isResending.value = true;
    
    try {
      const token = await getAccessTokenSilently();
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user.value.sub
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al reenviar email de verificación');
      }
      
      return { 
        success: true, 
        message: 'Email de verificación enviado correctamente. Revisa tu bandeja de entrada.' 
      };
    } catch (error) {
      console.error('Error reenviando email:', error);
      throw new Error(error.message || 'Error al reenviar email de verificación');
    } finally {
      isResending.value = false;
    }
  }
  
  // Función para verificar el estado actual del email
  async function checkEmailVerificationStatus() {
    if (!isAuthenticated.value || isChecking.value) {
      return false;
    }
    
    // Evitar múltiples verificaciones muy seguidas
    const now = Date.now();
    if (lastCheckTime.value && (now - lastCheckTime.value) < 3000) {
      return isEmailVerified.value;
    }
    
    isChecking.value = true;
    lastCheckTime.value = now;
    
    try {
      const token = await getAccessTokenSilently();
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/auth/check-verification`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Si el email está verificado, forzar recarga del perfil de Auth0
        if (data.email_verified && !isEmailVerified.value) {
          await refreshUserProfile();
        }
        
        return data.email_verified || false;
      }
      
      return isEmailVerified.value;
    } catch (error) {
      console.error('Error verificando estado del email:', error);
      return isEmailVerified.value;
    } finally {
      isChecking.value = false;
    }
  }
  
  // Función para forzar una actualización del perfil de usuario
  async function refreshUserProfile() {
    try {
      // Obtener token actualizado que incluya la información más reciente
      const token = await getAccessTokenSilently({ 
        cacheMode: 'off',
        ignoreCache: true 
      });
      
      // Hacer llamada para refrescar el perfil
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/auth/refresh-profile`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        // Recargar la página para obtener el token actualizado
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error('Error refrescando perfil:', error);
      // Fallback: recargar página directamente
      window.location.reload();
    }
  }
  
  return {
    isEmailVerified,
    userEmail,
    requiresEmailVerification,
    isChecking,
    isResending,
    resendVerificationEmail,
    checkEmailVerificationStatus,
    refreshUserProfile
  };
}