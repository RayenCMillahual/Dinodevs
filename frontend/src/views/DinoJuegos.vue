<template>
  <div class="juegos-container">
    <div class="botones-superiores">
      <button v-if="vistaActual === 'memoria'" @click="volverAJuegos">
        <i class="fas fa-arrow-left"></i> Volver a Juegos
      </button>
      <button @click="cerrarSesion">
        <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
      </button>
    </div>

    <!-- Vista principal de juegos -->
    <div v-if="vistaActual === 'juegos'" class="vista-juegos">
      <h1 class="titulo-principal">
        <i class="fas fa-gamepad"></i>
        DinoJuegos
      </h1>
      <p class="subtitulo">¡Explora y juega con los dinosaurios!</p>
      
      <div class="juegos-grid">
        <div class="juego-item" @click="iniciarMemoryGame">
          <i class="fas fa-brain"></i>
          <span>Memoria de Dinosaurios</span>
          <small>Encuentra las parejas</small>
        </div>
        
        <div class="juego-item" @click="proximamente">
          <i class="fas fa-puzzle-piece"></i>
          <span>Rompecabezas Dino</span>
          <small>Próximamente</small>
        </div>
        
        <div class="juego-item" @click="proximamente">
          <i class="fas fa-trophy"></i>
          <span>Trivia Jurásica</span>
          <small>Próximamente</small>
        </div>
        
        <div class="juego-item" @click="proximamente">
          <i class="fas fa-running"></i>
          <span>Carrera Dino</span>
          <small>Próximamente</small>
        </div>
      </div>
    </div>

    <!-- Vista del Memory Game con mejoras -->
    <div v-if="vistaActual === 'memoria'" class="memory-game-wrapper">
      <div class="game-header">
        <h2>Juego de Memoria: Dinosaurios</h2>
        <div class="game-stats">
          <div class="stat-item">
            <i class="fas fa-stopwatch"></i>
            <span>Tiempo: {{ tiempoFormateado }}</span>
          </div>
          <div class="stat-item">
            <i class="fas fa-sync-alt"></i>
            <span>Intentos: {{ intentos }}</span>
          </div>
        </div>
      </div>
      
      <!-- Componente MemoryGame original -->
      <MemoryGame 
        ref="memoryGameRef"
        @game-started="iniciarTimer"
        @card-flipped="incrementarIntentos"
        @game-finished="onGameFinished"
      />
      
      <!-- Pantalla de victoria mejorada -->
      <div v-if="juegoTerminado" class="game-over-overlay">
        <div class="game-over-content">
          <h3>¡Felicitaciones!</h3>
          <p>Has completado el juego en {{ tiempoFormateado }}</p>
          <p>Con {{ intentos }} intentos</p>
          <div class="victory-buttons">
            <button @click="reiniciarJuego" class="btn-reiniciar">
              <i class="fas fa-redo"></i> Jugar de Nuevo
            </button>
            <button @click="volverAJuegos" class="btn-volver">
              <i class="fas fa-home"></i> Volver a Juegos
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { useRouter } from 'vue-router'
import MemoryGame from '@/components/MemoryGame.vue'

const { logout } = useAuth0()
const router = useRouter()

// Referencias
const memoryGameRef = ref(null)

// Estado de la aplicación
const vistaActual = ref('juegos')
const juegoTerminado = ref(false)

// Estado de estadísticas
const intentos = ref(0)
const tiempoInicio = ref(0)
const tiempoActual = ref(0)
const intervalTimer = ref(null)

// Computed properties
const tiempoFormateado = computed(() => {
  if (tiempoInicio.value === 0) return '00:00'
  const segundos = Math.floor((tiempoActual.value - tiempoInicio.value) / 1000)
  const minutos = Math.floor(segundos / 60)
  const segs = segundos % 60
  return `${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`
})

// Métodos principales
async function cerrarSesion() {
  // Mostrar confirmación
  const confirmar = confirm('¿Estás seguro de que quieres cerrar sesión?');
  
  if (!confirmar) {
    return;
  }

  try {
    // Crear overlay de loading personalizado
    const overlay = document.createElement('div');
    overlay.className = 'logout-overlay';
    overlay.innerHTML = `
      <div class="logout-content">
        <div class="logout-spinner"></div>
        <h3>Cerrando sesión...</h3>
        <p>Nos vemos pronto, explorador jurásico!</p>
      </div>
    `;
    
    // Agregar estilos
    const style = document.createElement('style');
    style.textContent = `
      .logout-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(46, 77, 61, 0.95);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        backdrop-filter: blur(5px);
        font-family: 'Georgia', serif;
      }
      
      .logout-content {
        background: linear-gradient(135deg, #4a7a5b, #5c8a70);
        padding: 40px;
        border-radius: 20px;
        text-align: center;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
        color: #f0ead2;
        max-width: 400px;
        width: 90%;
      }
      
      .logout-spinner {
        width: 50px;
        height: 50px;
        border: 4px solid rgba(240, 234, 210, 0.3);
        border-top: 4px solid #d4c9a1;
        border-radius: 50%;
        animation: logout-spin 1s linear infinite;
        margin: 0 auto 20px;
      }
      
      .logout-content h3 {
        font-size: 1.8rem;
        color: #d4c9a1;
        margin-bottom: 15px;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      
      .logout-content p {
        font-size: 1.1rem;
        color: #bba76d;
        margin: 0;
        font-style: italic;
      }
      
      @keyframes logout-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(overlay);
    
    // Detener cualquier timer que esté corriendo
    detenerTimer();
    
    // Esperar un momento para mostrar la animación
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Realizar logout
    await logout({ 
      logoutParams: {
        returnTo: window.location.origin 
      }
    });
    
  } catch (error) {
    console.error('Error durante el logout:', error);
    
    // Limpiar overlay si existe
    const overlay = document.querySelector('.logout-overlay');
    if (overlay) {
      document.body.removeChild(overlay);
    }
    
    // Mostrar mensaje de error
    alert('Hubo un problema cerrando la sesión. Inténtalo de nuevo.');
    
    // Fallback: redirigir manualmente
    window.location.href = '/';
  }
}

// Función alternativa más simple (si la anterior da problemas)
function cerrarSesionSimple() {
  const confirmar = confirm('¿Estás seguro de que quieres cerrar sesión?');
  
  if (confirmar) {
    // Detener timers
    detenerTimer();
    
    // Logout directo con manejo de URL
    logout({ 
      logoutParams: {
        returnTo: `${window.location.protocol}//${window.location.host}`
      }
    });
  }
}

function iniciarMemoryGame() {
  vistaActual.value = 'memoria'
  juegoTerminado.value = false
  resetearEstadisticas()
}

function volverAJuegos() {
  vistaActual.value = 'juegos'
  detenerTimer()
  juegoTerminado.value = false
}

function proximamente() {
  alert('¡Este juego estará disponible pronto!')
}

// Métodos de estadísticas
function resetearEstadisticas() {
  intentos.value = 0
  tiempoInicio.value = 0
  tiempoActual.value = 0
  detenerTimer()
}

function iniciarTimer() {
  if (tiempoInicio.value === 0) {
    tiempoInicio.value = Date.now()
    tiempoActual.value = Date.now()
    
    intervalTimer.value = setInterval(() => {
      tiempoActual.value = Date.now()
    }, 1000)
  }
}

function detenerTimer() {
  if (intervalTimer.value) {
    clearInterval(intervalTimer.value)
    intervalTimer.value = null
  }
}

function incrementarIntentos() {
  intentos.value++
  iniciarTimer() // Inicia el timer en el primer movimiento
}

function onGameFinished() {
  juegoTerminado.value = true
  detenerTimer()
}

function reiniciarJuego() {
  juegoTerminado.value = false
  resetearEstadisticas()
  
  // Reiniciar el componente MemoryGame
  if (memoryGameRef.value && memoryGameRef.value.reiniciarJuego) {
    memoryGameRef.value.reiniciarJuego()
  }
}

// Lifecycle hooks
onUnmounted(() => {
  detenerTimer()
})
</script>

<style scoped>
.juegos-container {
  background-color: #2e4d3d;
  color: #f0ead2;
  padding: 1rem;
  font-family: 'Georgia', serif;
  text-align: center;
  width: 100%;
  max-width: none;
  margin: 0;
  min-height: 100vh;
  box-sizing: border-box;
}

.botones-superiores {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
  gap: 10px;
  flex-wrap: wrap;
}

button {
  background-color: #4a7a5b;
  color: #f0ead2;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s;
  white-space: nowrap;
}

button:hover {
  background-color: #5b8e6b;
}

/* Estilos de la vista principal */
.vista-juegos {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 1rem;
  width: 100%;
  box-sizing: border-box;
}

.titulo-principal {
  font-size: 3rem;
  color: #d4c9a1;
  margin-bottom: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 3px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  word-wrap: break-word;
}

.titulo-principal i {
  margin-right: 15px;
  color: #4a7a5b;
}

.subtitulo {
  font-size: 1.2rem;
  color: #bba76d;
  margin-bottom: 40px;
  font-style: italic;
}

.juegos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 16px;
  width: 100%;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.juego-item {
  background: linear-gradient(135deg, #4a7a5b, #5c8a70);
  color: #f0ead2;
  padding: 30px 20px;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  font-family: 'Raleway', sans-serif;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s, box-shadow 0.3s;
  position: relative;
  overflow: hidden;
  min-height: 150px;
  width: 100%;
  box-sizing: border-box;
}

.juego-item i {
  font-size: 2.5rem;
  margin-bottom: 15px;
  color: #d4c9a1;
}

.juego-item span {
  font-size: 1.3rem;
  font-weight: bold;
  margin-bottom: 8px;
  word-wrap: break-word;
}

.juego-item small {
  font-size: 0.9rem;
  color: #bba76d;
  font-style: italic;
}

.juego-item:before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: rgba(255, 255, 255, 0.1);
  transform: rotate(45deg);
  transition: all 0.5s ease;
}

.juego-item:hover:before {
  top: -70%;
  left: -70%;
  background: rgba(255, 255, 255, 0.2);
}

.juego-item:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

/* Estilos del wrapper del Memory Game */
.memory-game-wrapper {
  position: relative;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
  width: 100%;
  box-sizing: border-box;
}

.game-header {
  margin-bottom: 20px;
}

.game-header h2 {
  font-size: 2.5rem;
  color: #d4c9a1;
  margin-bottom: 20px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2px;
  word-wrap: break-word;
}

.game-stats {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.stat-item {
  background-color: #3c6652;
  padding: 10px 20px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  white-space: nowrap;
  min-width: fit-content;
}

.stat-item i {
  color: #d4c9a1;
}

/* Overlay de victoria */
.game-over-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(46, 77, 61, 0.95);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
  padding: 1rem;
  box-sizing: border-box;
}

.game-over-content {
  background: linear-gradient(135deg, #4a7a5b, #5c8a70);
  padding: 40px;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  max-width: 400px;
  width: 100%;
  box-sizing: border-box;
}

.game-over-content h3 {
  font-size: 2.5rem;
  color: #d4c9a1;
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: 2px;
  word-wrap: break-word;
}

.game-over-content p {
  font-size: 1.2rem;
  margin-bottom: 15px;
  color: #f0ead2;
}

.victory-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 25px;
  flex-wrap: wrap;
}

.btn-reiniciar, .btn-volver {
  background-color: #d4c9a1;
  color: #2e4d3d;
  padding: 12px 20px;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  flex: 1 1 auto;
  min-width: 140px;
  justify-content: center;
}

.btn-reiniciar:hover, .btn-volver:hover {
  background-color: #bba76d;
  transform: scale(1.05);
}

.btn-volver {
  background-color: #3c6652;
  color: #f0ead2;
}

.btn-volver:hover {
  background-color: #4a7a5b;
}

/* Estilos para ocultar elementos del componente original */
.memory-game-wrapper :deep(.memory-game) {
  background-color: transparent;
  padding: 0;
  height: auto;
  min-height: auto;
}

.memory-game-wrapper :deep(.memory-game h2) {
  display: none;
}

.memory-game-wrapper :deep(.game-over) {
  display: none;
}

/* Responsive Design Mejorado */
@media (max-width: 1024px) {
  .juegos-container {
    padding: 1rem 0.5rem;
  }
  
  .vista-juegos {
    padding: 0 0.5rem;
  }
  
  .memory-game-wrapper {
    padding: 0 0.5rem;
  }
}

@media (max-width: 768px) {
  .juegos-container {
    padding: 0.5rem 0.25rem;
  }
  
  .botones-superiores {
    justify-content: center;
    gap: 8px;
  }
  
  .titulo-principal {
    font-size: 2.2rem;
    letter-spacing: 1px;
    margin-bottom: 8px;
  }
  
  .titulo-principal i {
    margin-right: 10px;
  }
  
  .subtitulo {
    font-size: 1.1rem;
    margin-bottom: 30px;
  }
  
  .juegos-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 15px;
    margin-top: 12px;
  }
  
  .juego-item {
    padding: 25px 15px;
    min-height: 130px;
  }
  
  .juego-item i {
    font-size: 2.2rem;
    margin-bottom: 12px;
  }
  
  .juego-item span {
    font-size: 1.2rem;
  }
  
  .game-header h2 {
    font-size: 2rem;
    letter-spacing: 1px;
    margin-bottom: 15px;
  }
  
  .game-stats {
    flex-direction: column;
    align-items: center;
    gap: 15px;
  }
  
  .stat-item {
    padding: 8px 16px;
  }
  
  .victory-buttons {
    flex-direction: column;
    gap: 12px;
  }
  
  .btn-reiniciar, .btn-volver {
    width: 100%;
    min-width: auto;
  }
  
  .game-over-content {
    padding: 30px 20px;
    margin: 0 1rem;
  }
  
  .game-over-content h3 {
    font-size: 2rem;
    letter-spacing: 1px;
  }
  
  .game-over-content p {
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  .juegos-container {
    padding: 0.5rem 0.125rem;
  }
  
  button {
    padding: 6px 12px;
    font-size: 0.8rem;
  }
  
  .titulo-principal {
    font-size: 1.8rem;
    letter-spacing: 0.5px;
    margin-bottom: 6px;
  }
  
  .titulo-principal i {
    margin-right: 8px;
  }
  
  .subtitulo {
    font-size: 1rem;
    margin-bottom: 25px;
  }
  
  .juegos-grid {
    grid-template-columns: 1fr;
    gap: 12px;
    margin-top: 10px;
  }
  
  .juego-item {
    font-size: 0.9rem;
    padding: 20px 12px;
    min-height: 120px;
  }
  
  .juego-item i {
    font-size: 2rem;
    margin-bottom: 10px;
  }
  
  .juego-item span {
    font-size: 1.1rem;
    margin-bottom: 6px;
  }
  
  .juego-item small {
    font-size: 0.8rem;
  }
  
  .game-header h2 {
    font-size: 1.6rem;
    margin-bottom: 12px;
  }
  
  .stat-item {
    padding: 6px 12px;
    font-size: 0.9rem;
  }
  
  .game-over-content {
    padding: 25px 15px;
    margin: 0 0.5rem;
  }
  
  .game-over-content h3 {
    font-size: 1.6rem;
    margin-bottom: 15px;
  }
  
  .game-over-content p {
    font-size: 1rem;
    margin-bottom: 12px;
  }
  
  .btn-reiniciar, .btn-volver {
    padding: 10px 16px;
    font-size: 0.9rem;
  }
}

@media (max-width: 320px) {
  .titulo-principal {
    font-size: 1.5rem;
  }
  
  .titulo-principal i {
    margin-right: 6px;
  }
  
  .subtitulo {
    font-size: 0.9rem;
  }
  
  .juego-item {
    padding: 18px 10px;
    min-height: 110px;
  }
  
  .juego-item i {
    font-size: 1.8rem;
  }
  
  .juego-item span {
    font-size: 1rem;
  }
  
  .game-header h2 {
    font-size: 1.4rem;
  }
  
  .game-over-content h3 {
    font-size: 1.4rem;
  }
  
  .btn-reiniciar, .btn-volver {
    padding: 8px 12px;
    font-size: 0.8rem;
  }
}
</style>