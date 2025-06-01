<template>
  <div class="dino-info">
    <img src="@/assets/DatoCurioso.png" alt="Dinosaurio" class="foto-dato-curioso">

    <div class="texto-info">
      <h1>¿Sabías que...?</h1>
      <p class="dato-curioso">{{ dataCurioso }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      datosCuriosos: [
        "🌍 Los dinosaurios vivieron en la Tierra durante más de 160 millones de años.",
        "🦕 El Argentinosaurus es el dinosaurio más grande descubierto, con hasta 40 metros de largo.",
        "🦖 El T-Rex tenía una mordida 🦷 más fuerte que la de cualquier animal terrestre conocido.",
        "🦜 Algunos dinosaurios tenían plumas, lo que confirma su relación con las aves.",
        "🐦 Los dinosaurios no se extinguieron completamente, las aves modernas son sus descendientes.",
        "🏃‍♂️ El dinosaurio más rápido era el Ornithomimus, podía correr a hasta 70 km/h.",
        "🐾 Los dinosaurios no arrastraban la cola, la mantenían elevada para el equilibrio.",
        "🌈 Los dinosaurios podían haber tenido colores brillantes, como las aves actuales.",
        "🦷 Los herbívoros tenían dientes que se regeneraban constantemente, como los tiburones.",
        "🛡️ El cráneo del Triceratops tenía huesos que absorbían golpes en peleas territoriales.",
        "🔨 El Ankylosaurus tenía una armadura ósea y una cola en forma de mazo para defenderse.",
        "🦕 El Brachiosaurus tenía patas delanteras más largas que las traseras, lo que le daba una postura inclinada.",
        "🥚 Los dinosaurios ponían huevos y algunos los protegían en nidos, como el Oviraptor.",
        "❄️ Se han descubierto fósiles de dinosaurios en todos los continentes, incluso en la Antártida.",
        "🌊 Algunos dinosaurios eran excelentes nadadores, como el Spinosaurus.",
        "🔥 El impacto del asteroide causó incendios masivos, lluvia ácida y oscureció el cielo durante meses.",
        "🔎 Los científicos descubren nuevos dinosaurios cada año y se cree que aún faltan muchos por encontrar.",
        "🦖 El Compsognathus era uno de los dinosaurios más pequeños, con solo 60 cm de largo.",
        "📢 El Parasaurolophus tenía una cresta en la cabeza que usaba para emitir sonidos como una trompeta."
      ],
      dataCurioso: "", // Muestra un dato a la vez
      index: 0, // Índice del dato actual
      intervalo: null // Guardará el intervalo para que los datos cambien automáticamente
    };
  },
  methods: {
    siguienteDato() {
      this.index = (this.index + 1) % this.datosCuriosos.length;
      this.dataCurioso = this.datosCuriosos[this.index];
    }
  },
  mounted() {
    this.dataCurioso = this.datosCuriosos[this.index]; // Inicializa con el primer dato
    this.intervalo = setInterval(this.siguienteDato, 6000);
  },
  beforeUnmount() {
    clearInterval(this.intervalo);
  }
};
</script>

<style scoped>
.dino-info {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 20px;
  background: url('@/assets/jungle.jpg') no-repeat center center;
  background-size: cover;

}

.foto-dato-curioso {
  width: 20%;
  max-width: 600px;
  border-radius: 10px;
}

.texto-info {
  display: flex;
  flex-direction: column; /* Pone "¿Sabías que...?" encima del dato */
  align-items: center;
  margin-left: 20px;
}

h1 {
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.dato-curioso {
  font-size: 1.2rem;
  font-style: italic;
  margin: 15px 0;
  animation: fadeIn 0.5s ease-in-out;
}

/* Animación para los datos */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
