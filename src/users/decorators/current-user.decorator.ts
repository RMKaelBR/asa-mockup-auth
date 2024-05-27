import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    console.log(request.session);
    console.log(request.session.userId.toString() + request.session.email);
    return 'Current User accessed';
  }
)