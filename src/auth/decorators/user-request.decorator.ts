import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type UserJwt = {
  id: string;
  email: string;
};

export const UserRequest = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
