import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { Auth0Strategy } from './auth.strategy';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'auth0' })],
  providers: [Auth0Strategy],
  exports: [],
})
export class AuthModule {}