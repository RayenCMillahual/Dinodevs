// backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { JuegosModule } from './juegos/juegos.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000, // 1 minuto
      limit: 10, // 10 requests por minuto
    }]),
    PrismaModule,
    AuthModule,
    JuegosModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}