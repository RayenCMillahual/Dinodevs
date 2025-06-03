// backend/src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { Auth0Strategy } from './auth.strategy';
import { AuthController } from './auth.controller';
import { Auth0Service } from './auth0.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'auth0' }),
    ConfigModule
  ],
  controllers: [AuthController],
  providers: [Auth0Strategy, Auth0Service, JwtAuthGuard],
  exports: [Auth0Service, JwtAuthGuard],
})
export class AuthModule {}