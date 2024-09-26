import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { jwtConstants } from "@/shared/security/constants";
import { UserService } from "@/user/user.service";
import type { AuthRequest, JWTPayload, ValidatedUser } from "./auth.types";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  validateUser(username: string, password: string) {
    const user = this.usersService.findOne(username);

    if (!user || user.password !== password) {
      return null;
    }

    const validatedUser: ValidatedUser = {
      id: user.id,
      username: user.username,
      role: user.role,
    };
    return validatedUser;
  }

  async login(req: AuthRequest) {
    const payload: JWTPayload = {
      username: req.user.username,
      sub: req.user.id,
      role: req.user.role,
    };
    return {
      token: this.jwtService.sign(payload, {
        privateKey: jwtConstants.JWT_SECRET,
        expiresIn: jwtConstants.JWT_EXPIRES_IN,
      }),
    };
  }
}
