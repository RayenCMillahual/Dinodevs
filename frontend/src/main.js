import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import { createAuth0 } from '@auth0/auth0-vue';
import '@fortawesome/fontawesome-free/css/all.css';

const app = createApp(App);

app.use(createPinia());

const authDomain = import.meta.env.VITE_AUTH0_DOMAIN || import.meta.env.VUE_APP_AUTH0_DOMAIN;
const authClientId = import.meta.env.VITE_AUTH0_CLIENT_ID || import.meta.env.VUE_APP_AUTH0_CLIENT_ID;
const authAudience = import.meta.env.VITE_AUTH0_AUDIENCE || import.meta.env.VUE_APP_AUTH0_AUDIENCE;

console.log('Auth0 Domain:', authDomain);
console.log('Auth0 Audience:', authAudience);

app.use(
  createAuth0({
    domain: authDomain,
    clientId: authClientId,
    authorizationParams: {
      redirect_uri: window.location.origin,
      audience: authAudience,
    },
  })
);;

app.use(router);
app.mount('#app');