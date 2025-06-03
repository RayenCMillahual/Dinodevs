// backend/src/juegos/juegos.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JuegosService {
  constructor(private readonly prisma: PrismaService) {}

  async getJuegosDisponibles() {
    try {
      // Obtener juegos de la base de datos
      const juegos = await this.prisma.juego.findMany({
        select: {
          id: true,
          nombre: true,
          descripcion: true,
        }
      });

      // Si no hay juegos en la BD, devolver datos por defecto
      if (juegos.length === 0) {
        return [
          {
            id: 1,
            nombre: 'Memoria de Dinosaurios',
            descripcion: 'Encuentra las parejas de dinosaurios',
            disponible: true
          },
          {
            id: 2,
            nombre: 'Trivia Jurásica',
            descripcion: 'Pon a prueba tus conocimientos',
            disponible: false
          },
          {
            id: 3,
            nombre: 'Rompecabezas Dino',
            descripcion: 'Arma el dinosaurio pieza por pieza',
            disponible: false
          }
        ];
      }

      return juegos.map(juego => ({
        ...juego,
        disponible: juego.id === 1 // Solo el juego de memoria está disponible por ahora
      }));
    } catch (error) {
      console.error('Error obteniendo juegos:', error);
      // Devolver datos por defecto en caso de error
      return [
        {
          id: 1,
          nombre: 'Memoria de Dinosaurios',
          descripcion: 'Encuentra las parejas de dinosaurios',
          disponible: true
        }
      ];
    }
  }

  async guardarPuntaje(userId: string, puntajeData: {
    juegoId: number;
    puntuacion: number;
    tiempo: number;
    intentos: number;
  }) {
    try {
      // Buscar o crear usuario en la base de datos local
      let usuario = await this.prisma.usuario.findFirst({
        where: { email: userId } // Usar email como identificador único
      });

      if (!usuario) {
        // Crear usuario básico si no existe
        usuario = await this.prisma.usuario.create({
          data: {
            nombre: 'Usuario',
            email: userId,
            contraseña: 'auth0_user' // Placeholder, ya que la auth es por Auth0
          }
        });
      }

      // Buscar o crear juego
      let juego = await this.prisma.juego.findUnique({
        where: { id: puntajeData.juegoId }
      });

      if (!juego) {
        // Crear juego básico si no existe
        juego = await this.prisma.juego.create({
          data: {
            id: puntajeData.juegoId,
            nombre: 'Memoria de Dinosaurios',
            descripcion: 'Encuentra las parejas de dinosaurios'
          }
        });
      }

      // Guardar puntaje
      const puntaje = await this.prisma.puntaje.create({
        data: {
          usuarioId: usuario.id,
          juegoId: juego.id,
          puntuacion: puntajeData.puntuacion,
          fecha: new Date()
        }
      });

      return {
        success: true,
        puntaje: {
          id: puntaje.id,
          puntuacion: puntaje.puntuacion,
          fecha: puntaje.fecha,
          tiempo: puntajeData.tiempo,
          intentos: puntajeData.intentos
        }
      };
    } catch (error) {
      console.error('Error guardando puntaje:', error);
      throw new Error('Error al guardar puntaje');
    }
  }

  async getPuntajesUsuario(userId: string) {
    try {
      const usuario = await this.prisma.usuario.findFirst({
        where: { email: userId }
      });

      if (!usuario) {
        return [];
      }

      const puntajes = await this.prisma.puntaje.findMany({
        where: { usuarioId: usuario.id },
        include: {
          juego: {
            select: {
              nombre: true
            }
          }
        },
        orderBy: {
          fecha: 'desc'
        },
        take: 10 // Últimos 10 puntajes
      });

      return puntajes.map(puntaje => ({
        id: puntaje.id,
        juegoId: puntaje.juegoId,
        nombreJuego: puntaje.juego.nombre,
        puntuacion: puntaje.puntuacion,
        fecha: puntaje.fecha
      }));
    } catch (error) {
      console.error('Error obteniendo puntajes:', error);
      return [];
    }
  }
}