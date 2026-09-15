import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';
import { createHash, randomUUID } from 'crypto';
import { PrismaService } from '../../../shared/database/prisma.service';
import { LoginDto, RegisterDto } from '../api/dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly jwt: JwtService, private readonly config: ConfigService) {}

  async register(dto: RegisterDto) {
    if (dto.passwordConfirmation !== undefined && dto.password !== dto.passwordConfirmation) throw new BadRequestException('Passwords do not match');
    const user = await this.prisma.user.create({ data: { name: dto.name, email: dto.email.toLowerCase(), passwordHash: await hash(dto.password, 12) } });
    return this.issueTokens(user);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email.toLowerCase() } });
    if (!user || !(await compare(dto.password, user.passwordHash))) throw new UnauthorizedException('Invalid credentials');
    return this.issueTokens(user);
  }

  async refresh(refreshToken: string) {
    let payload: { sub: string; tokenId: string };
    try { payload = await this.jwt.verifyAsync(refreshToken, { secret: this.config.getOrThrow('JWT_REFRESH_SECRET') }); }
    catch { throw new UnauthorizedException('Invalid refresh token'); }
    const stored = await this.prisma.refreshToken.findUnique({ where: { id: payload.tokenId } });
    if (!stored || stored.revokedAt || stored.expiresAt <= new Date() || stored.tokenHash !== this.digest(refreshToken)) throw new UnauthorizedException('Refresh token expired or revoked');
    await this.prisma.refreshToken.update({ where: { id: stored.id }, data: { revokedAt: new Date() } });
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: payload.sub } });
    return this.issueTokens(user);
  }

  async logout(userId: string) {
    await this.prisma.refreshToken.updateMany({ where: { userId, revokedAt: null }, data: { revokedAt: new Date() } });
    return { message: 'Logged out' };
  }

  private async issueTokens(user: { id: string; email: string; name: string }) {
    const tokenId = randomUUID();
    const accessToken = await this.jwt.signAsync({ sub: user.id, email: user.email }, { secret: this.config.getOrThrow('JWT_ACCESS_SECRET'), expiresIn: this.config.get('JWT_ACCESS_TTL') });
    const refreshToken = await this.jwt.signAsync({ sub: user.id, tokenId }, { secret: this.config.getOrThrow('JWT_REFRESH_SECRET'), expiresIn: this.config.get('JWT_REFRESH_TTL') });
    await this.prisma.refreshToken.create({ data: { id: tokenId, userId: user.id, tokenHash: this.digest(refreshToken), expiresAt: new Date(Date.now() + 30 * 86400000) } });
    return { user: { id: user.id, name: user.name, email: user.email }, token: accessToken, accessToken, refreshToken };
  }

  private digest(value: string) { return createHash('sha256').update(value).digest('hex'); }
}
