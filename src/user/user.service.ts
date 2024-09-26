import { Injectable } from "@nestjs/common";

import { UserRoles } from "@/shared/security/userRoles";
import { User } from "./user";

@Injectable()
export class UserService {
  private users: User[] = [
    new User(1, "admin", "admin", UserRoles.ADMIN),
    new User(2, "fullReader", "fullReader", UserRoles.FULL_READER),
    new User(3, "limitedReader", "limitedReader", UserRoles.LIMITED_READER),
    new User(4, "writer", "writer", UserRoles.WRITER),
    new User(5, "remover", "remover", UserRoles.DELETE),
  ];

  findOne(username: string) {
    return this.users.find((user) => user.username === username);
  }
}
