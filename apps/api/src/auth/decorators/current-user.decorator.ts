import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { User } from '../../users/entities/user.entity';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): User | null => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return (request as Request & { user?: User }).user ?? null;
  },
);
