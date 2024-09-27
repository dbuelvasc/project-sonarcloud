import { Test, TestingModule } from "@nestjs/testing";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "@/user/user.service";
import { AuthService } from "./auth.service";
import { UserRoles } from "@/shared/security/userRoles";

describe("AuthService", () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should return a validated user if the credentials are valid", async () => {
    const user = {
      id: 1,
      username: "admin",
      password: "admin",
      role: UserRoles.ADMIN,
    };

    jest.spyOn(userService, "findOne").mockReturnValue(user);

    const result = service.validateUser("admin", "admin");

    expect(userService.findOne).toHaveBeenCalledWith("admin");
    expect(result).toEqual({
      id: 1,
      username: "admin",
      role: UserRoles.ADMIN,
    });
  });

  it("should return null if the user is not found", async () => {
    jest.spyOn(userService, "findOne").mockReturnValue(null);

    const result = service.validateUser("testuser", "password");

    expect(userService.findOne).toHaveBeenCalledWith("testuser");
    expect(result).toBeNull();
  });

  it("should return null if the password is incorrect", async () => {
    const user = {
      id: 1,
      username: "admin",
      password: "admin",
      role: UserRoles.ADMIN,
    };
    jest.spyOn(userService, "findOne").mockReturnValue(user);

    const result = service.validateUser("testuser", "wrongpassword");

    expect(userService.findOne).toHaveBeenCalledWith("testuser");
    expect(result).toBeNull();
  });

  it("should return a token if the login is successful", async () => {
    const user = {
      id: 1,
      username: "admin",
      password: "admin",
      role: UserRoles.ADMIN,
    };
    const token = "generatedtoken";
    jest.spyOn(jwtService, "sign").mockReturnValue(token);

    const result = service.login({ user } as any);

    expect(result).toEqual({ token });
  });
});
