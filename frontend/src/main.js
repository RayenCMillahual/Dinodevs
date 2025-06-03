// frontend/src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import { createAuth0 } from '@auth0/auth0-vue';
import '@fortawesome/fontawesome-free/css/all.css';

const app = createApp(App);

app.use(createPinia());

// Configuración de Auth0 con variables de entorno
const authDomain = import.meta.env.VITE_AUTH0_DOMAIN;
const authClientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
const authAudience = import.meta.env.VITE_AUTH0_AUDIENCE;

console.log('🔧 Configuración Auth0:');
console.log('Domain:', authDomain);
console.log('Client ID:', authClientId);
console.log('Audience:', authAudience);

// Verificar que las variables de entorno estén configuradas
if (!authDomain || !authClientId) {
  console.error('❌ Error: Variables de entorno de Auth0 no configuradas');
  console.log('Asegúrate de tener VITE_AUTH0_DOMAIN y VITE_AUTH0_CLIENT_ID en tu archivo .env');
}

app.use(
  createAuth0({
    domain: authDomain,
    clientId: authClientId,
    authorizationParams: {
      redirect_uri: 'http://localhost:3000',
      audience: authAudience,
      scope: 'openid profile email'
    },
    cacheLocation: 'localstorage',
    useRefreshTokens: true,
  })
);

app.use(router);

// Manejo global de errores
app.config.errorHandler = (err, vm, info) => {
  console.error('❌ Error global:', err);
  console.error('Información:', info);
};

app.mount('#app');

console.log('🚀 Aplicación iniciada correctamente');