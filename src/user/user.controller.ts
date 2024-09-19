import { Controller, Post, Req, UseGuards } from "@nestjs/common";

import { AuthService } from "@/auth/auth.service";
import { LocalAuthGuard } from "@/auth/guards";
import type { AuthRequest } from "@/auth/auth.types";

@Controller("users")
export class UserController {
  constructor(private readonly authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Post("login")
  async login(@Req() req: AuthRequest) {
    return this.authService.login(req);
  }
}
