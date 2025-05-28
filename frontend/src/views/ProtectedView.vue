<template>
  <div>
    <h2>Datos Protegidos</h2>
    <button @click="fetchData" :disabled="loading">
      {{ loading ? 'Cargando...' : 'Cargar Datos' }}
    </button>
    <pre v-if="data">{{ data }}</pre>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuth0 } from '@auth0/auth0-vue';
import api from '@/services/api';

const data = ref(null);
const loading = ref(false);
const { getAccessTokenSilently, isAuthenticated } = useAuth0();

async function fetchData() {
  if (!isAuthenticated.value) {
    alert('Debes iniciar sesión primero');
    return;
  }

  loading.value = true;
  try {
    const token = await getAccessTokenSilently();
    const resp = await api.get('/protected/data', {
      headers: { Authorization: `Bearer ${token}` },
    });
    data.value = resp.data;
  } catch (e) {
    if (e.response?.status === 401) alert('No autorizado');
    else console.error(e);
  } finally {
    loading.value = false;
  }
}
</script>