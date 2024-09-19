import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { jwtConstants } from "@/shared/security/constants";
import { User } from "@/user/user";
import { UserService } from "@/user/user.service";
import type { AuthRequest, ValidatedUser } from "./auth.types";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<ValidatedUser | null> {
    const user: User = await this.usersService.findOne(username);

    if (!user || user.password !== password) {
      return null;
    }

    const validatedUser: ValidatedUser = {
      id: user.id,
      username: user.username,
      roles: user.roles,
    };
    return validatedUser;
  }

  async login(req: AuthRequest) {
    const payload = {
      username: req.user.username,
      sub: req.user.id,
      roles: req.user.roles,
    };
    return {
      token: this.jwtService.sign(payload, {
        privateKey: jwtConstants.JWT_SECRET,
        expiresIn: jwtConstants.JWT_EXPIRES_IN,
      }),
    };
  }
}
