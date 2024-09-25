import { UserRoles } from "@/shared/security/userRoles";

export class User {
  constructor(
    public id: number,
    public username: string,
    public password: string,
    public role: UserRoles,
  ) {}
}
