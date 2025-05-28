<template>
  <div class="memory-game">
    <div class="game-board">
      <div
        class="card"
        v-for="(card, index) in shuffledCards"
        :key="`${gameKey}-${index}`"
        @click="flipCard(card)"
        :class="{'flipped': card.flipped || card.matched, 'matched': card.matched}"
      >
        <div class="card-inner">
          <div class="card-front">
            <img v-if="card.flipped || card.matched" :src="card.image" alt="Dinosaurio" />
          </div>
          <div class="card-back">
            <div class="card-back-content">🦖</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dino1 from '@/assets/dino1.png';
import dino2 from '@/assets/dino2.png';
import dino3 from '@/assets/dino3.png';

export default {
  emits: ['game-started', 'card-flipped', 'game-finished'],
  data() {
    return {
      gameKey: 0, // Para forzar re-render cuando se reinicia
      cards: [
        { image: dino1, flipped: false, matched: false },
        { image: dino1, flipped: false, matched: false },
        { image: dino2, flipped: false, matched: false },
        { image: dino2, flipped: false, matched: false },
        { image: dino3, flipped: false, matched: false },
        { image: dino3, flipped: false, matched: false },
      ],
      flippedCards: [],
      gameOver: false,
      gameStarted: false,
    };
  },
  computed: {
    shuffledCards() {
      return this.shuffleCards([...this.cards]);
    }
  },
  methods: {
    shuffleCards(cards) {
      return cards.sort(() => Math.random() - 0.5);
    },
    flipCard(card) {
      if (this.flippedCards.length === 2 || card.flipped || card.matched) return;

      // Emitir evento de inicio del juego en el primer movimiento
      if (!this.gameStarted) {
        this.gameStarted = true;
        this.$emit('game-started');
      }

      card.flipped = true;
      this.flippedCards.push(card);

      // Emitir evento de carta volteada (solo cuando se voltean 2 cartas para contar como intento)
      if (this.flippedCards.length === 2) {
        this.$emit('card-flipped');
        setTimeout(this.checkMatch, 1000);
      }
    },
    checkMatch() {
      const [card1, card2] = this.flippedCards;

      if (card1.image === card2.image) {
        card1.matched = true;
        card2.matched = true;
      } else {
        card1.flipped = false;
        card2.flipped = false;
      }

      this.flippedCards = [];

      if (this.cards.every(card => card.matched)) {
        this.gameOver = true;
        this.$emit('game-finished');
      }
    },
    reiniciarJuego() {
      this.cards.forEach(card => {
        card.flipped = false;
        card.matched = false;
      });
      this.flippedCards = [];
      this.gameOver = false;
      this.gameStarted = false;
      this.gameKey++; // Incrementa la key para forzar re-render
    }
  }
};
</script>

<style scoped>
.memory-game {
  background-color: #2e4d3d;
  color: #f0ead2;
  padding: 20px;
  text-align: center;
  font-family: 'Raleway', sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
}

.game-board {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 15px;
  margin: 20px auto;
  justify-items: center;
  width: 100%;
  max-width: 600px;
  overflow: hidden;
}

.card {
  width: 150px;
  height: 150px;
  background-color: #3c6652;
  color: #f0ead2;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 15px;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.3s, box-shadow 0.3s ease, background-color 0.4s;
  overflow: hidden;
}

.card:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

.card.matched {
  background: linear-gradient(135deg, #5b8e6b, #6ba57a);
  box-shadow: 0 0 20px rgba(212, 201, 161, 0.3);
}

.card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 15px;
  visibility: hidden;
  transition: visibility 0.5s ease;
}

.card.flipped img {
  visibility: visible;
}

.card-inner {
  width: 100%;
  height: 100%;
  position: absolute;
  transform-style: preserve-3d;
  transition: transform 0.6s ease;
}

.card.flipped .card-inner {
  transform: rotateY(180deg);
}

.card-front, .card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  backface-visibility: hidden;
  border-radius: 15px;
}

.card-front {
  background: linear-gradient(135deg, #4a7a5b, #5c8a70);
  transform: rotateY(180deg);
}

.card-back {
  background: linear-gradient(135deg, #3c6652, #4a7a5b);
}

.card-back-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  font-size: 2.5rem;
}

@media (max-width: 768px) {
  .game-board {
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(2, 1fr);
    width: 100%;
    gap: 10px;
  }

  .card {
    width: 120px;
    height: 120px;
  }

  .card-back-content {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .game-board {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(3, 1fr);
    width: 90%;
    gap: 8px;
  }

  .card {
    width: 90px;
    height: 90px;
  }

  .card-back-content {
    font-size: 1.5rem;
  }
}
</style>