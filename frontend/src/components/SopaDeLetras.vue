<template>
  <div class="sopa-de-letras">
    <h2>Sopa de Letras</h2>
    <div class="grid">
      <div v-for="(letter, index) in grid" :key="index" class="letter">
        {{ letter }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      grid: [
        'D', 'I', 'N', 'O', 'R',
        'E', 'X', 'P', 'E', 'R',
        'R', 'A', 'V', 'S', 'L',
        'T', 'M', 'A', 'K', 'J',
        'B', 'C', 'H', 'Z', 'Y'
      ]
    };
  }
};
</script>

<style scoped>
.sopa-de-letras {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: Arial, sans-serif;
}

h2 {
  font-size: 2rem;
  margin-bottom: 20px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(5, 40px); /* Cuadrícula 5x5 */
  grid-template-rows: repeat(5, 40px);
  gap: 5px;
  margin-bottom: 20px;
}

.letter {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  cursor: pointer;
  border-radius: 5px;
}

.letter:hover {
  background-color: #e0e0e0;
}
</style>
