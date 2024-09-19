import { Test, TestingModule } from "@nestjs/testing";

import { TypeOrmTestingConfig } from "@/shared/testing-utils/typeorm-testing-config";
import { CountryRestaurantService } from "./country-restaurant.service";

describe("CountryRestaurantService", () => {
  let service: CountryRestaurantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CountryRestaurantService],
    }).compile();

    service = module.get<CountryRestaurantService>(CountryRestaurantService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
