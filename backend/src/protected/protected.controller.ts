import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs/operators';

@Controller('protected')
export class ProtectedController {
  constructor(private readonly http: HttpService) {}

  @UseGuards(JwtAuthGuard)
  @Get('data')
  getExternalData(@Req() req) {
    return this.http
      .get('https://api.otro-servidor.com/data')
      .pipe(map(resp => resp.data));
  }
}