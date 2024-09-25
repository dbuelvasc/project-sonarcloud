import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

import { User } from "@/user/user";

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const allowedEndpointRoles = this.reflector.get<string[] | undefined>(
      "roles",
      context.getHandler(),
    );

    if (!allowedEndpointRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest<{ user: User }>();

    return allowedEndpointRoles.some(
      (endpointRole) => endpointRole === user.role,
    );
  }
}
