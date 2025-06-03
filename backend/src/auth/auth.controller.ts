// backend/src/auth/auth.controller.ts
import { 
  Controller, 
  Post, 
  Get, 
  Body, 
  UseGuards, 
  Request, 
  HttpException, 
  HttpStatus 
} from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Auth0Service } from './auth0.service';

@Controller('auth') // Cambiar de 'api/auth' a solo 'auth'
export class AuthController {
  constructor(private readonly auth0Service: Auth0Service) {}

  @Get('test-connection')
  async testAuth0Connection() {
    try {
      const isConnected = await this.auth0Service.testConnection();
      return {
        success: isConnected,
        message: isConnected ? 'Conexión con Auth0 exitosa' : 'Error de conexión con Auth0',
        timestamp: new Date().toISOString()
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Error de conexión con Auth0',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  @Post('resend-verification')
  @UseGuards(JwtAuthGuard)
  async resendVerificationEmail(@Request() req, @Body() body: { userId?: string }) {
    try {
      const userSub = req.user.sub;
      const { userId } = body;

      console.log('🔄 Solicitud de reenvío de verificación para:', userSub);

      // Verificar que el usuario está intentando verificar su propio email
      if (userId && userId !== userSub) {
        throw new HttpException(
          'No autorizado para realizar esta acción', 
          HttpStatus.FORBIDDEN
        );
      }

      const result = await this.auth0Service.resendVerificationEmail(userSub);
      
      return {
        success: result.success,
        message: result.message,
        ticket_url: result.ticket_url
      };
    } catch (error: any) {
      console.error('❌ Error reenviando email de verificación:', error);
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        error.message || 'Error interno del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('check-verification')
  @UseGuards(JwtAuthGuard)
  async checkEmailVerificationStatus(@Request() req) {
    try {
      const userSub = req.user.sub;
      console.log('🔍 Verificando estado de email para:', userSub);
      
      const userInfo = await this.auth0Service.getUserInfo(userSub);
      
      return {
        email_verified: userInfo.email_verified || false,
        email: userInfo.email,
        user_id: userInfo.user_id
      };
    } catch (error: any) {
      console.error('❌ Error verificando estado del email:', error);
      throw new HttpException(
        'Error interno del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('user-profile')
  @UseGuards(JwtAuthGuard)
  async getUserProfile(@Request() req) {
    try {
      const userSub = req.user.sub;
      const userInfo = await this.auth0Service.getUserInfo(userSub);
      
      return {
        success: true,
        user: userInfo
      };
    } catch (error: any) {
      console.error('❌ Error obteniendo perfil:', error);
      throw new HttpException(
        'Error al obtener perfil de usuario',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('refresh-profile')
  @UseGuards(JwtAuthGuard)
  async refreshUserProfile(@Request() req) {
    try {
      const userSub = req.user.sub;
      const userInfo = await this.auth0Service.getUserInfo(userSub);
      
      return {
        user: {
          email: userInfo.email,
          email_verified: userInfo.email_verified,
          name: userInfo.name,
          picture: userInfo.picture,
          user_id: userInfo.user_id
        }
      };
    } catch (error: any) {
      console.error('❌ Error refrescando perfil:', error);
      throw new HttpException(
        'Error interno del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}