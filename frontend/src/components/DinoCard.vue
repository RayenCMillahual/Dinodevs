<template>
  <div class="dino-card">
    <h2>{{ dino.nombreComun }} ({{ dino.nombreCientifico }})</h2>
    <img :src="dino.image" alt="Imagen de {{ dino.nombreComun }}" />
    <p><strong>Tipo de Alimentación:</strong> {{ dino.tipoAlimentacion }}</p>
    <p><strong>Periodo:</strong> {{ dino.periodo }}</p>
    <p><strong>Tamaño:</strong> {{ dino.tamano }}</p>
    <p><strong>Peso:</strong> {{ dino.peso }}</p>
    <p><strong>Ubicación Geográfica:</strong> {{ dino.ubicacionGeografica }}</p>
    <p><strong>Curiosidades:</strong> {{ dino.curiosidades }}</p>
  </div>
</template>

<script setup>
defineProps(['dino'])
</script>

<style scoped>
.dino-card {
  background-color: rgba(224, 221, 192, 0.973);

  border: 1px solid #220f0f;
  padding: 16px;
  margin: 8px;
  width: 300px;
  text-align: center;
  border-radius: 40px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 1);

}
p{
  color: #142018;
}

h2{
  color: #220f0f;
}
.dino-card img {
  max-width: 100%;
  height: auto;
  margin-bottom: 8px;
}
</style>
