<template>
  <div class="wrapper transition-ease-linear">
    <header>
      <img alt="Dinos Devs Logo" class="logo" src="@/assets/logoDinosDevs.png" width="160" height="160" />
       
      <!-- Botón hamburguesa -->
      <button class="menu-toggle" @click="toggleMenu">☰</button>
       
      <!-- Menú de navegación -->
      <nav :class="{ open: isMenuOpen }">
        <RouterLink to="/" @click="toggleMenu">Home</RouterLink>
        <RouterLink to="/informacion" @click="toggleMenu">Información</RouterLink>
        <RouterLink to="/juegos" @click="toggleMenu">Juegos</RouterLink>
      </nav>
    </header>
     
    <RouterView />
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { ref } from 'vue'

const isMenuOpen = ref(false)

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}
</script>

<style scoped>
/* Base styles */
.wrapper {
  width: 100%;
  min-height: 100vh;
}

.wrapper.dark {
  background: #434343;
  min-height: 100vh;
}

/* Header responsivo */
header {
  height: 130px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #172c10;
  padding: 0 clamp(1rem, 3vw, 2rem);
  flex-wrap: wrap;
  position: relative;
  width: 100%;
  box-sizing: border-box;
}

/* Logo responsivo */
.logo {
  margin-left: clamp(10px, 2vw, 20px);
  width: clamp(80px, 15vw, 160px);
  height: auto;
  max-width: 160px;
  flex-shrink: 0;
}

/* Botón hamburguesa */
.menu-toggle {
  background: none;
  border: none;
  font-size: clamp(1.5rem, 4vw, 2rem);
  color: #218f24;
  display: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.menu-toggle:hover {
  background-color: rgba(33, 143, 36, 0.1);
}

/* Navegación */
nav {
  font-size: clamp(18px, 3vw, 25px);
  text-align: right;
  margin-top: 2rem;
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  display: flex;
  gap: clamp(0.5rem, 2vw, 1rem);
  align-items: center;
}

nav a {
  display: inline-block;
  padding: clamp(0.3rem, 1vw, 1rem);
  text-decoration: none;
  color: rgba(33, 143, 36, 0.986);
  transition: color 0.3s ease;
  white-space: nowrap;
  border-radius: 4px;
}

nav a:hover {
  cursor: url('src/assets/garra2.png'), default;
  color: #4ade80;
  background-color: rgba(33, 143, 36, 0.1);
}

nav a.router-link-exact-active {
  color: rgb(197, 188, 57);
  background-color: rgba(197, 188, 57, 0.1);
}

/* Tablets grandes y desktop pequeño */
@media (max-width: 1024px) {
  nav {
    font-size: clamp(16px, 2.5vw, 22px);
    gap: clamp(0.3rem, 1.5vw, 0.8rem);
  }
  
  nav a {
    padding: clamp(0.2rem, 0.8vw, 0.8rem);
  }
}

/* Tablets */
@media (max-width: 768px) {
  header {
    height: clamp(100px, 15vw, 130px);
    padding: 0 clamp(0.5rem, 2vw, 1rem);
  }
  
  .menu-toggle {
    display: block;
    z-index: 1001;
  }
   
  nav {
    display: none;
    flex-direction: column;
    position: absolute;
    top: 100%;
    right: clamp(10px, 3vw, 20px);
    width: clamp(200px, 50vw, 300px);
    background-color: #fcfffaec;
    text-align: center;
    padding: clamp(0.5rem, 2vw, 1rem) 0;
    margin-top: 0;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    z-index: 1000;
    gap: 0;
  }
   
  nav.open {
    display: flex;
  }
  
  nav a {
    display: block;
    width: 100%;
    padding: clamp(0.8rem, 3vw, 1rem);
    margin: 0;
    color: #172c10;
    font-size: clamp(16px, 4vw, 20px);
    border-bottom: 1px solid rgba(23, 44, 16, 0.1);
  }
  
  nav a:last-child {
    border-bottom: none;
  }
  
  nav a:hover {
    background-color: rgba(33, 143, 36, 0.1);
    color: #218f24;
  }
  
  nav a.router-link-exact-active {
    color: rgb(197, 188, 57);
    background-color: rgba(197, 188, 57, 0.15);
  }
}

/* Móviles */
@media (max-width: 480px) {
  header {
    height: clamp(80px, 18vw, 110px);
    padding: 0 clamp(0.5rem, 3vw, 1rem);
  }
  
  .logo {
    margin-left: clamp(5px, 2vw, 10px);
    width: clamp(60px, 18vw, 100px);
  }
  
  .menu-toggle {
    font-size: clamp(1.2rem, 5vw, 1.8rem);
    padding: clamp(0.3rem, 1vw, 0.5rem);
  }
  
  nav {
    right: clamp(5px, 2vw, 15px);
    width: clamp(180px, 60vw, 250px);
    padding: clamp(0.5rem, 3vw, 1rem) 0;
  }
  
  nav a {
    font-size: clamp(14px, 4.5vw, 18px);
    padding: clamp(0.6rem, 3vw, 1rem);
  }
}

/* Móviles muy pequeños */
@media (max-width: 320px) {
  header {
    height: clamp(70px, 20vw, 90px);
    padding: 0 0.5rem;
  }
  
  .logo {
    width: clamp(50px, 20vw, 80px);
    margin-left: 5px;
  }
  
  nav {
    width: clamp(160px, 70vw, 200px);
    right: 5px;
  }
  
  nav a {
    font-size: clamp(12px, 5vw, 16px);
    padding: clamp(0.5rem, 3vw, 0.8rem);
  }
}

/* Landscape en móviles */
@media (max-height: 500px) and (orientation: landscape) {
  header {
    height: clamp(60px, 12vh, 90px);
  }
  
  .logo {
    width: clamp(40px, 10vh, 80px);
  }
  
  nav {
    top: 100%;
    max-height: 60vh;
    overflow-y: auto;
  }
  
  nav a {
    padding: clamp(0.4rem, 2vh, 0.8rem);
  }
}

/* Asegurar que el contenido no se desborde */
* {
  box-sizing: border-box;
}

/* Prevenir scroll horizontal */
html, body {
  overflow-x: hidden;
  width: 100%;
}

/* Transiciones suaves para cambios de tamaño */
.logo, nav, nav a, .menu-toggle {
  transition: all 0.3s ease;
}

/* Asegurar que el menú se cierre al hacer click fuera (opcional) */
@media (max-width: 768px) {
  .wrapper {
    position: relative;
  }
}
</style>