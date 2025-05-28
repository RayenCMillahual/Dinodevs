<template>
    <div class="container-form">
      <h2>¿No tenés cuenta? ¡Regístrate!</h2>
      <button @click="signup" class="btn-auth">
        Registrarse 🦖
      </button>
    </div>
  </template>
  
  <script setup>
  import { useAuth0 } from '@auth0/auth0-vue';
  
  const { loginWithRedirect } = useAuth0();
  
  function signup() {
    loginWithRedirect({
      authorizationParams: {
        screen_hint: 'signup',
        redirect_uri: window.location.origin + '/juegos'
      }
    });
  }
  </script>
  
  <style scoped>
  .btn-auth {
    margin-top: 25px;
    background-color: #33633d6c;
    padding: 12px 24px;
    border-radius: 8px;
    color: white;
    font-size: 1rem;
    border: none;
    cursor: pointer;
  }
  .btn-auth:hover {
    background-color: #2e5a2e;
  }
  </style>
  