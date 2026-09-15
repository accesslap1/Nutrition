import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { PlatformModule } from './platform/platform.module';

@Module({ imports: [AuthModule, PlatformModule, HealthModule], exports: [AuthModule, PlatformModule] })
export class CoreModule {}
