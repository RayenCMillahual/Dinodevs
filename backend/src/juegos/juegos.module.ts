import { Module } from '@nestjs/common';
import { JuegosController } from './juegos.controller';
import { JuegosService } from './juegos.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [JuegosController],
  providers: [JuegosService],
  exports: [JuegosService],
})
export class JuegosModule {}