import { Test, TestingModule } from "@nestjs/testing";

import { UserService } from "./user.service";

describe("UserService", () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should return a user if it exists", () => {
    expect(service.findOne("admin")).toBeDefined();
  });

  it("should return undefined if the user does not exist", () => {
    expect(service.findOne("testuser")).toBeUndefined();
  });
});
