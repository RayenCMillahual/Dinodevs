<template>
  <div class="container">
    <div class="register-prompt">
      <h2>¡Debes iniciar sesión para jugar!</h2>
      <p>Regístrate o inicia sesión para acceder a la sección de juegos</p>
      <div class="button-container">
        <button @click="loginWithRedirect({ authorizationParams: { redirect_uri: window.location.origin + '/juegos' } })" class="btn-estilos">
          Iniciar Sesión
        </button>
        <button @click="loginWithRedirect({ authorizationParams: { screen_hint: 'signup', redirect_uri: window.location.origin + '/juegos' } })" class="btn-estilos bg-green-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-700">
          Registrarse
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuth0 } from '@auth0/auth0-vue';
const { loginWithRedirect } = useAuth0();
</script>

<style scoped>
.container {
  background: url('https://media.giphy.com/media/mTrUbEjM1Agta/giphy.gif') no-repeat center center;
  background-size: cover;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.register-prompt {
  text-align: center;
  padding: 30px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  color: #fff;
}
.button-container {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  justify-content: center;
}
.btn-estilos {
  background-color: #155335;
  color: #fff;
  border: none;
  padding: 12px 24px;
  font-size: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
}
.btn-estilos:hover {
  background-color: #225c22;
}
</style>
