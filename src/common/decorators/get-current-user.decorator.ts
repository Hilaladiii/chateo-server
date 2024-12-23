import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayoad } from '../types/jwt.type';

export const GetCurrentUserId = createParamDecorator(
  (_: undefined, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayoad;
    return user.sub;
  },
);
