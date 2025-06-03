// backend/src/auth/auth0.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class Auth0Service {
  private domain: string;
  private clientId: string;
  private clientSecret: string;
  private managementToken = ''; // ya no es nullable
  private tokenExpiry: number = 0;

  constructor(private configService: ConfigService) {
    this.domain = this.getEnvOrThrow('AUTH0_DOMAIN');
    this.clientId = this.getEnvOrThrow('AUTH0_CLIENT_ID');
    this.clientSecret = this.getEnvOrThrow('AUTH0_CLIENT_SECRET');

    console.log('✅ Auth0Service inicializado correctamente');
    console.log('Domain:', this.domain);
    console.log('Client ID:', this.clientId);
  }

  private getEnvOrThrow(key: string): string {
    const value = this.configService.get<string>(key);
    if (typeof value !== 'string' || value.trim() === '') {
      throw new Error(`Missing or invalid environment variable: ${key}`);
    }
    return value;
  }

  async getUserInfo(userId: string) {
    try {
      const token = await this.getManagementToken();
      const response = await axios.get(
        `https://${this.domain}/api/v2/users/${encodeURIComponent(userId)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const user = response.data;
      return {
        email: user.email || '',
        email_verified: Boolean(user.email_verified),
        name: user.name || '',
        picture: user.picture || '',
        user_id: user.user_id || '',
        created_at: user.created_at || '',
        updated_at: user.updated_at || '',
      };
    } catch (error: any) {
      console.error('Error obteniendo usuario de Auth0:', error.response?.data || error.message);
      if (error.response?.status === 404) {
        throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
      }
      if (error.response?.status === 401) {
        throw new HttpException('Token inválido', HttpStatus.UNAUTHORIZED);
      }
      throw new HttpException('Error interno', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async resendVerificationEmail(userId: string) {
    try {
      const user = await this.getUserInfo(userId);

      if (user.email_verified) {
        throw new HttpException('El email ya está verificado', HttpStatus.BAD_REQUEST);
      }

      const token = await this.getManagementToken();
      const frontendUrl = this.getEnvOrThrow('FRONTEND_URL');

      const ticketData = {
        user_id: userId,
        result_url: `${frontendUrl}/juegos`,
        ttl_sec: 432000,
      };

      const response = await axios.post(
        `https://${this.domain}/api/v2/tickets/email-verification`,
        ticketData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        success: true,
        message: 'Email enviado correctamente',
        ticket_url: response.data.ticket || '',
      };
    } catch (error: any) {
      console.error('Error reenviando email:', error.response?.data || error.message);
      if (error instanceof HttpException) throw error;

      if (error.response?.status === 400) {
        throw new HttpException(`Datos inválidos: ${error.response.data?.message}`, HttpStatus.BAD_REQUEST);
      }

      if (error.response?.status === 403) {
        throw new HttpException('Permisos insuficientes', HttpStatus.FORBIDDEN);
      }

      throw new HttpException('Error interno', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateUser(userId: string, updateData: any) {
    try {
      const token = await this.getManagementToken();

      const response = await axios.patch(
        `https://${this.domain}/api/v2/users/${encodeURIComponent(userId)}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('Error actualizando usuario:', error.response?.data || error.message);
      throw new HttpException('Error al actualizar usuario', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async getManagementToken(): Promise<string> {
    if (this.managementToken && Date.now() < this.tokenExpiry) {
        return this.managementToken!;
    }

    try {
      const response = await axios.post(
        `https://${this.domain}/oauth/token`,
        {
          client_id: this.clientId,
          client_secret: this.clientSecret,
          audience: `https://${this.domain}/api/v2/`,
          grant_type: 'client_credentials',
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      this.managementToken = response.data.access_token;
      this.tokenExpiry = Date.now() + 23 * 60 * 60 * 1000; // 23h
      return this.managementToken;
    } catch (error: any) {
      console.error('Error obteniendo token:', error.response?.data || error.message);
      if (error.response?.status === 401) {
        throw new HttpException('Credenciales inválidas', HttpStatus.UNAUTHORIZED);
      }
      throw new HttpException('Error de autenticación', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.getManagementToken();
      return true;
    } catch (error: any) {
      console.error('Error de conexión:', error.message);
      return false;
    }
  }
}
