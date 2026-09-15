import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../../shared/security/current-user.decorator';
import { JwtAuthGuard } from '../../auth/api/jwt-auth.guard';
import type { AuthenticatedUser } from '../../auth/domain/authenticated-user';
import { PlatformService } from '../application/platform.service';
import { ConsentDto, CreateGoalDto, CreateMeasurementDto, ModuleDto, RecordStreakDto, UpdateActivityDto, UpdateGoalDto, UpdateProfileDto, UpdateSettingsDto } from './platform.dto';

@UseGuards(JwtAuthGuard)
@Controller()
export class PlatformController {
  constructor(private readonly platform: PlatformService) {}

  @Get('profile') profile(@CurrentUser() user: AuthenticatedUser) { return this.platform.profile(user.id); }
  @Post('profile') updateProfile(@CurrentUser() user: AuthenticatedUser, @Body() dto: UpdateProfileDto) { return this.platform.updateProfile(user.id, dto); }

  @Get('subscription') subscription(@CurrentUser() user: AuthenticatedUser) { return this.platform.subscription(user.id); }
  @Get('entitlements') entitlements(@CurrentUser() user: AuthenticatedUser) { return this.platform.entitlements(user.id); }

  @Get('goals') goals(@CurrentUser() user: AuthenticatedUser, @Query('category') category?: string, @Query('status') status?: string) { return this.platform.goals(user.id, category, status); }
  @Post('goals') createGoal(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateGoalDto) { return this.platform.createGoal(user.id, dto); }
  @Put('goals/:id') updateGoal(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string, @Body() dto: UpdateGoalDto) { return this.platform.updateGoal(user.id, id, dto); }
  @Delete('goals/:id') deleteGoal(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) { return this.platform.deleteGoal(user.id, id); }

  @Get('measurements') measurements(@CurrentUser() user: AuthenticatedUser) { return this.platform.measurements(user.id); }
  @Get('measurements/latest') latestMeasurement(@CurrentUser() user: AuthenticatedUser) { return this.platform.latestMeasurement(user.id); }
  @Post('measurements') createMeasurement(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateMeasurementDto) { return this.platform.createMeasurement(user.id, dto); }

  @Get('activity/today') activityToday(@CurrentUser() user: AuthenticatedUser) { return this.platform.activityToday(user.id); }
  @Get('activity/history') activityHistory(@CurrentUser() user: AuthenticatedUser) { return this.platform.activityHistory(user.id); }
  @Post('activity') updateActivity(@CurrentUser() user: AuthenticatedUser, @Body() dto: UpdateActivityDto) { return this.platform.updateActivity(user.id, dto); }

  @Get('streaks') streaks(@CurrentUser() user: AuthenticatedUser) { return this.platform.streaks(user.id); }
  @Post('streaks/record') recordStreak(@CurrentUser() user: AuthenticatedUser, @Body() dto: RecordStreakDto) { return this.platform.recordStreak(user.id, dto.type); }

  @Get('notifications') notifications(@CurrentUser() user: AuthenticatedUser) { return this.platform.notifications(user.id); }
  @Get('notifications/unread') unreadNotifications(@CurrentUser() user: AuthenticatedUser) { return this.platform.unreadNotifications(user.id); }
  @Post('notifications/read-all') markAllRead(@CurrentUser() user: AuthenticatedUser) { return this.platform.markAllRead(user.id); }
  @Post('notifications/:id/read') markRead(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) { return this.platform.markRead(user.id, id); }

  @Get('settings') settings(@CurrentUser() user: AuthenticatedUser) { return this.platform.settings(user.id); }
  @Post('settings') updateSettings(@CurrentUser() user: AuthenticatedUser, @Body() dto: UpdateSettingsDto) { return this.platform.updateSettings(user.id, dto); }

  @Get('modules') modules(@CurrentUser() user: AuthenticatedUser) { return this.platform.modules(user.id); }
  @Post('modules/activate') activateModule(@CurrentUser() user: AuthenticatedUser, @Body() dto: ModuleDto) { return this.platform.activateModule(user.id, dto.moduleName); }
  @Post('modules/deactivate') deactivateModule(@CurrentUser() user: AuthenticatedUser, @Body() dto: ModuleDto) { return this.platform.deactivateModule(user.id, dto.moduleName); }

  @Get('consents') consents(@CurrentUser() user: AuthenticatedUser) { return this.platform.consents(user.id); }
  @Post('consents/grant') grantConsent(@CurrentUser() user: AuthenticatedUser, @Body() dto: ConsentDto) { return this.platform.grantConsent(user.id, dto); }
  @Post('consents/revoke') revokeConsent(@CurrentUser() user: AuthenticatedUser, @Body() dto: ConsentDto) { return this.platform.revokeConsent(user.id, dto); }
  @Post('consents/check') checkConsent(@CurrentUser() user: AuthenticatedUser, @Body() dto: ConsentDto) { return this.platform.checkConsent(user.id, dto); }

  @Get('module/user-context') userContext(@CurrentUser() user: AuthenticatedUser) { return this.platform.userContext(user.id); }
}
