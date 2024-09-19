import { Test, TestingModule } from "@nestjs/testing";
import { CountryRestaurantService } from "./country-restaurant.service";

describe("CountryRestaurantService", () => {
  let service: CountryRestaurantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CountryRestaurantService],
    }).compile();

    service = module.get<CountryRestaurantService>(CountryRestaurantService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
