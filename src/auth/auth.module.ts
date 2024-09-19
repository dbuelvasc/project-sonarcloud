import { Module } from "@nestjs/common";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import constants from "@/shared/security/constants";
import { UserModule } from "@/user/user.module";
import { UserService } from "@/user/user.service";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./strategies/jwtStrategy";
import { LocalStrategy } from "./strategies/localStrategy";

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: constants.JWT_SECRET,
      signOptions: { expiresIn: constants.JWT_EXPIRES_IN },
    }),
  ],
  providers: [AuthService, UserService, JwtService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
