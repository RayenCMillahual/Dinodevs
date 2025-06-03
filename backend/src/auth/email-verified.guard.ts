// backend/src/auth/email-verified.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Auth0Service } from './auth0.service';

interface AuthenticatedRequest {
  user: {
    sub: string;
    [key: string]: any;
  };
  userInfo?: any;
}

@Injectable()
export class EmailVerifiedGuard implements CanActivate {
  constructor(private readonly auth0Service: Auth0Service) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    if (!user || !user.sub) {
      throw new ForbiddenException('Usuario no autenticado');
    }

    try {
      // Obtener información actualizada del usuario desde Auth0
      const userInfo = await this.auth0Service.getUserInfo(user.sub);
      
      if (!userInfo.email_verified) {
        throw new ForbiddenException({
          message: 'Email no verificado',
          error: 'EMAIL_NOT_VERIFIED',
          details: 'Debes verificar tu email antes de acceder a esta funcionalidad'
        });
      }

      // Agregar la información del usuario al request para uso posterior
      request.userInfo = userInfo;
      
      return true;
    } catch (error: any) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      
      console.error('Error verificando email:', error);
      throw new ForbiddenException('Error al verificar el estado del email');
    }
  }
}