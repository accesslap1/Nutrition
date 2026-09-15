import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../shared/database/prisma.service';
import { ConsentDto, CreateGoalDto, CreateMeasurementDto, UpdateActivityDto, UpdateGoalDto, UpdateProfileDto, UpdateSettingsDto } from '../api/platform.dto';
import { nextStreak } from '../domain/streak-policy';

const allowedModules = new Set(['nutrition', 'fitness', 'weight_body', 'sleep_recovery', 'mental_wellness', 'habits_lifestyle', 'beauty_selfcare', 'preventive_wellness', 'womens_wellness', 'mens_wellness', 'family_wellness', 'workplace_wellness', 'coaching', 'connected_health', 'community', 'education']);

@Injectable()
export class PlatformService {
  constructor(private readonly prisma: PrismaService) {}

  profile(userId: string) { return this.prisma.profile.findUnique({ where: { userId } }).then((value) => value ?? Promise.reject(new NotFoundException('Profile not found'))); }
  updateProfile(userId: string, dto: UpdateProfileDto) { return this.prisma.profile.upsert({ where: { userId }, create: { userId, ...dto, dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined }, update: { ...dto, dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined } }); }

  goals(userId: string, category?: string, status?: string) { return this.prisma.goal.findMany({ where: { userId, category, status: status as any } }); }
  createGoal(userId: string, dto: CreateGoalDto) { return this.prisma.goal.create({ data: { userId, ...dto, deadline: dto.deadline ? new Date(dto.deadline) : undefined } }); }
  async updateGoal(userId: string, id: string, dto: UpdateGoalDto) { await this.assertOwned('goal', id, userId); return this.prisma.goal.update({ where: { id }, data: { ...dto, deadline: dto.deadline ? new Date(dto.deadline) : undefined } }); }
  async deleteGoal(userId: string, id: string) { await this.assertOwned('goal', id, userId); await this.prisma.goal.delete({ where: { id } }); return { message: 'Goal deleted' }; }

  measurements(userId: string) { return this.prisma.bodyMeasurement.findMany({ where: { userId }, orderBy: { measuredAt: 'desc' } }); }
  createMeasurement(userId: string, dto: CreateMeasurementDto) { return this.prisma.bodyMeasurement.create({ data: { userId, ...dto, measuredAt: new Date(dto.measuredAt) } }); }
  async latestMeasurement(userId: string) { const item = await this.prisma.bodyMeasurement.findFirst({ where: { userId }, orderBy: { measuredAt: 'desc' } }); if (!item) throw new NotFoundException('No measurements found'); return item; }

  async activityToday(userId: string) { const date = this.startOfToday(); return (await this.prisma.activitySummary.findUnique({ where: { userId_date: { userId, date } } })) ?? { date: this.dateString(date), steps: 0, caloriesBurned: 0, activeMinutes: 0, distanceKm: 0, waterMl: 0 }; }
  activityHistory(userId: string) { return this.prisma.activitySummary.findMany({ where: { userId }, orderBy: { date: 'desc' }, take: 30 }); }
  updateActivity(userId: string, dto: UpdateActivityDto) { const date = new Date(`${dto.date}T00:00:00.000Z`); const data = { steps: dto.steps, caloriesBurned: dto.caloriesBurned, activeMinutes: dto.activeMinutes, distanceKm: dto.distanceKm, waterMl: dto.waterMl }; return this.prisma.activitySummary.upsert({ where: { userId_date: { userId, date } }, create: { userId, date, ...data }, update: data }); }

  streaks(userId: string) { return this.prisma.streak.findMany({ where: { userId } }); }
  async recordStreak(userId: string, type: string) { const today = this.startOfToday(); const current = await this.prisma.streak.findUnique({ where: { userId_type: { userId, type } } }); const next = nextStreak(current, today); return this.prisma.streak.upsert({ where: { userId_type: { userId, type } }, create: { userId, type, ...next }, update: next }); }

  notifications(userId: string) { return this.prisma.notification.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 50 }); }
  async unreadNotifications(userId: string) { const notifications = await this.prisma.notification.findMany({ where: { userId, readAt: null }, orderBy: { createdAt: 'desc' } }); return { count: notifications.length, notifications }; }
  async markRead(userId: string, id: string) { const result = await this.prisma.notification.updateMany({ where: { id, userId }, data: { readAt: new Date() } }); if (!result.count) throw new NotFoundException('Notification not found'); return { message: 'Marked as read' }; }
  async markAllRead(userId: string) { await this.prisma.notification.updateMany({ where: { userId, readAt: null }, data: { readAt: new Date() } }); return { message: 'All notifications marked as read' }; }

  settings(userId: string) { return this.prisma.setting.upsert({ where: { userId }, create: { userId }, update: {} }); }
  updateSettings(userId: string, dto: UpdateSettingsDto) { return this.prisma.setting.upsert({ where: { userId }, create: { userId, ...dto }, update: dto }); }

  subscription(userId: string) { return this.prisma.subscription.findUnique({ where: { userId } }).then((item) => item ? { ...item, isActive: item.status === 'active' && (!item.expiresAt || item.expiresAt > new Date()) } : { plan: 'free', status: 'active', isActive: true, expiresAt: null }); }
  async entitlements(userId: string) { const subscription = await this.subscription(userId); const paid = subscription.isActive && subscription.plan !== 'free'; return { canBrowse: true, canAccessFeatures: paid, plan: subscription.plan }; }

  modules(userId: string) { return this.prisma.userModule.findMany({ where: { userId } }); }
  activateModule(userId: string, moduleName: string) { if (!allowedModules.has(moduleName)) throw new ForbiddenException('Unknown module'); return this.prisma.userModule.upsert({ where: { userId_moduleName: { userId, moduleName } }, create: { userId, moduleName, isActive: true, activatedAt: new Date() }, update: { isActive: true, activatedAt: new Date() } }); }
  async deactivateModule(userId: string, moduleName: string) { await this.prisma.userModule.updateMany({ where: { userId, moduleName }, data: { isActive: false } }); return { message: 'Module deactivated' }; }

  consents(userId: string) { return this.prisma.userConsent.findMany({ where: { userId } }); }
  grantConsent(userId: string, dto: ConsentDto) { return this.prisma.userConsent.upsert({ where: { userId_module_dataType: { userId, module: dto.module, dataType: dto.dataType } }, create: { userId, module: dto.module, dataType: dto.dataType, granted: true, grantedAt: new Date() }, update: { granted: true, grantedAt: new Date(), revokedAt: null } }); }
  async revokeConsent(userId: string, dto: ConsentDto) { await this.prisma.userConsent.updateMany({ where: { userId, module: dto.module, dataType: dto.dataType }, data: { granted: false, revokedAt: new Date() } }); return { message: 'Consent revoked' }; }
  async checkConsent(userId: string, dto: ConsentDto) { return { granted: Boolean(await this.prisma.userConsent.findFirst({ where: { userId, module: dto.module, dataType: dto.dataType, granted: true } })) }; }

  async userContext(userId: string) { const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId }, select: { id: true, name: true, email: true, profile: true, goals: { where: { status: 'active' } }, bodyMeasurements: { orderBy: { measuredAt: 'desc' }, take: 1 }, activitySummaries: { where: { date: this.startOfToday() }, take: 1 }, settings: true, subscription: true, _count: { select: { notifications: { where: { readAt: null } } } } } }); const paid = user.subscription?.status === 'active' && user.subscription.plan !== 'free'; return { user: { id: user.id, name: user.name, email: user.email }, profile: user.profile, goals: user.goals, latestMeasurement: user.bodyMeasurements[0] ?? null, activityToday: user.activitySummaries[0] ?? null, subscription: { plan: user.subscription?.plan ?? 'free', isActive: paid, canBrowse: true, canAccessFeatures: paid }, settings: user.settings, unreadNotifications: user._count.notifications }; }

  private async assertOwned(model: 'goal', id: string, userId: string) { const item = await this.prisma[model].findUnique({ where: { id }, select: { userId: true } }); if (!item) throw new NotFoundException(); if (item.userId !== userId) throw new ForbiddenException(); }
  private startOfToday() { const now = new Date(); return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())); }
  private dateString(date: Date) { return date.toISOString().slice(0, 10); }
}
