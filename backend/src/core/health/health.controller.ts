import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../../shared/database/prisma.service';

@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}
  @Get() async check() { await this.prisma.$queryRaw`SELECT 1`; return { status: 'ok', service: 'fitness-backend', timestamp: new Date().toISOString() }; }
}
