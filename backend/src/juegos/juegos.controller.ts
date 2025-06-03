// backend/src/juegos/juegos.controller.ts
import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  UseGuards, 
  Request,
  HttpException,
  HttpStatus 
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EmailVerifiedGuard } from '../auth/email-verified.guard';
import { JuegosService } from './juegos.service';

interface AuthenticatedRequest {
  user: {
    sub: string;
    [key: string]: any;
  };
  userInfo?: {
    email: string;
    email_verified: boolean;
    user_id: string;
    [key: string]: any;
  };
}

@Controller('juegos') // ← Cambiar de 'api/juegos' a solo 'juegos'
export class JuegosController {
  constructor(private readonly juegosService: JuegosService) {}

  @Get()
  @UseGuards(EmailVerifiedGuard) // Luego verificar email
  async getJuegos(@Request() req: AuthenticatedRequest) {
    try {
      // Solo usuarios con email verificado pueden acceder
      const userInfo = req.userInfo!; // Viene del EmailVerifiedGuard
      const juegos = await this.juegosService.getJuegosDisponibles();
      
      return {
        success: true,
        message: 'Lista de juegos disponibles',
        user: {
          email: userInfo.email,
          email_verified: userInfo.email_verified
        },
        juegos
      };
    } catch (error: any) {
      console.error('Error obteniendo juegos:', error);
      throw new HttpException(
        'Error al obtener lista de juegos',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('puntaje')
  @UseGuards(EmailVerifiedGuard)
  async guardarPuntaje(@Request() req: AuthenticatedRequest, @Body() puntajeData: {
    juegoId: number;
    puntuacion: number;
    tiempo: number;
    intentos: number;
  }) {
    try {
      const userInfo = req.userInfo!;
      
      // Validar datos de entrada
      if (!puntajeData.juegoId || !puntajeData.puntuacion || !puntajeData.tiempo || !puntajeData.intentos) {
        throw new HttpException(
          'Datos de puntaje incompletos',
          HttpStatus.BAD_REQUEST
        );
      }

      const resultado = await this.juegosService.guardarPuntaje(userInfo.email, puntajeData);
      
      return {
        success: resultado.success,
        message: 'Puntaje guardado correctamente',
        puntaje: resultado.puntaje
      };
    } catch (error: any) {
      console.error('Error guardando puntaje:', error);
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        'Error al guardar puntaje',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('mis-puntajes')
  @UseGuards(EmailVerifiedGuard)
  async getMisPuntajes(@Request() req: AuthenticatedRequest) {
    try {
      const userInfo = req.userInfo!;
      const puntajes = await this.juegosService.getPuntajesUsuario(userInfo.email);
      
      return {
        success: true,
        puntajes
      };
    } catch (error: any) {
      console.error('Error obteniendo puntajes:', error);
      throw new HttpException(
        'Error al obtener puntajes',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('estadisticas')
  @UseGuards(EmailVerifiedGuard)
  async getEstadisticas(@Request() req: AuthenticatedRequest) {
    try {
      const userInfo = req.userInfo!;
      const puntajes = await this.juegosService.getPuntajesUsuario(userInfo.email);
      
      // Calcular estadísticas básicas
      const totalJuegos = puntajes.length;
      const puntuacionPromedio = totalJuegos > 0 
        ? puntajes.reduce((sum, p) => sum + p.puntuacion, 0) / totalJuegos 
        : 0;
      const mejorPuntaje = totalJuegos > 0 
        ? Math.max(...puntajes.map(p => p.puntuacion)) 
        : 0;
      
      return {
        success: true,
        estadisticas: {
          totalJuegos,
          puntuacionPromedio: Math.round(puntuacionPromedio),
          mejorPuntaje,
          ultimoJuego: totalJuegos > 0 ? puntajes[0].fecha : null
        }
      };
    } catch (error: any) {
      console.error('Error obteniendo estadísticas:', error);
      throw new HttpException(
        'Error al obtener estadísticas',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}