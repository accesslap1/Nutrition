import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../../shared/security/current-user.decorator';
import type { AuthenticatedUser } from '../domain/authenticated-user';
import { AuthService } from '../application/auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LoginDto, RefreshDto, RegisterDto } from './dto/auth.dto';

@Controller()
export class AuthController {
  constructor(private readonly auth: AuthService) {}
  @Post('register') register(@Body() dto: RegisterDto) { return this.auth.register(dto); }
  @Post('login') login(@Body() dto: LoginDto) { return this.auth.login(dto); }
  @Post('refresh') refresh(@Body() dto: RefreshDto) { return this.auth.refresh(dto.refreshToken); }
  @UseGuards(JwtAuthGuard) @Post('logout') logout(@CurrentUser() user: AuthenticatedUser) { return this.auth.logout(user.id); }
}
