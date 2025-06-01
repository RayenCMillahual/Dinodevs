import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { HttpModule } from '@nestjs/axios';
import { ProtectedController } from './protected/protected.controller';
// import { DinosaursModule } from './dinosaurs/dinosaurs.module';
// import { RankingsModule } from './rankings/rankings.module';
// import { JuegosModule } from './juegos/juegos.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HttpModule,
    PrismaModule,
    AuthModule,
    UsersModule,
    // DinosaursModule,
    // RankingsModule,
    // JuegosModule,
  ],
  controllers: [ProtectedController],
})
export class AppModule {}
