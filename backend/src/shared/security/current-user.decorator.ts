import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import type { AuthenticatedUser } from '../../core/auth/domain/authenticated-user';

export const CurrentUser = createParamDecorator((_: unknown, context: ExecutionContext) =>
  context.switchToHttp().getRequest<Request & { user: AuthenticatedUser }>().user,
);
