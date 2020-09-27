import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUsername = createParamDecorator(
  (data, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    const { username, id } = req.user;

    return {
      id,
      username,
    };
  },
);
