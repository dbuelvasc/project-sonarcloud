import { faker } from "@faker-js/faker";
import { CacheModule } from "@nestjs/cache-manager";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { TypeOrmTestingConfig } from "@/shared/testing-utils/typeorm-testing-config";
import { RestaurantEntity } from "./restaurant.entity";
import { RestaurantService } from "./restaurant.service";

describe("RestaurantService", () => {
  let service: RestaurantService;
  let repository: Repository<RestaurantEntity>;
  let restaurantList: RestaurantEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig(), CacheModule.register()],
      providers: [RestaurantService],
    }).compile();

    service = module.get<RestaurantService>(RestaurantService);
    repository = module.get<Repository<RestaurantEntity>>(
      getRepositoryToken(RestaurantEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    restaurantList = [];
    for (let i = 0; i < 5; i++) {
      const restaurant: RestaurantEntity = await repository.save({
        name: faker.company.name(),
        city: faker.location.city(),
        michelinStars: faker.number.int({ min: 1, max: 3 }),
        awardDate: faker.date.past(),
        gastronomicCulture: [],
      });
      restaurantList.push(restaurant);
    }
  };

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should return all restaurants", async () => {
    const restaurants: RestaurantEntity[] = await service.findAll();
    expect(restaurants).not.toBeNull();
    expect(restaurants).toHaveLength(restaurantList.length);
  });

  it("should return restaurant by id", async () => {
    const storedRestaurant: RestaurantEntity = restaurantList[0];
    const restaurant: RestaurantEntity = await service.findOne(
      storedRestaurant.id,
    );
    expect(restaurant).not.toBeNull();
    expect(restaurant.name).toEqual(storedRestaurant.name);
    expect(restaurant.city).toEqual(storedRestaurant.city);
  });

  it("should throw an error when restaurant with given id is not found", async () => {
    await expect(service.findOne("-1")).rejects.toHaveProperty(
      "message",
      "The restaurant with the given id was not found",
    );
  });

  it("should create a restaurant", async () => {
    const restaurantData = {
      name: faker.company.name(),
      city: faker.location.city() || "Default City", // Asegurarse de que city no sea nulo
      michelinStars: faker.number.int({ min: 1, max: 3 }),
      awardDate: faker.date.past(),
      gastronomicCulture: [],
    };

    const newRestaurant: RestaurantEntity =
      await service.create(restaurantData);

    expect(newRestaurant).not.toBeNull();
    expect(newRestaurant.id).toBeDefined();
    expect(newRestaurant.name).toEqual(restaurantData.name);
    expect(newRestaurant.city).toEqual(restaurantData.city);
  });

  it("should update a restaurant", async () => {
    const restaurant: RestaurantEntity = restaurantList[0];
    restaurant.name = `${faker.company.name()} NEW`;
    restaurant.city = `${faker.location.city()} NEW`;

    const updatedRestaurant: RestaurantEntity = await service.update(
      restaurant.id,
      restaurant,
    );
    expect(updatedRestaurant).not.toBeNull();
    expect(updatedRestaurant.name).toEqual(restaurant.name);
    expect(updatedRestaurant.city).toEqual(restaurant.city);
  });

  it("should throw an error when restaurant with given id is not found", async () => {
    const restaurant: RestaurantEntity = restaurantList[0];
    restaurant.name = `${faker.company.name()} UPDATED`;
    restaurant.city = `${faker.location.city()} UPDATED`;

    await expect(service.update("-1", restaurant)).rejects.toHaveProperty(
      "message",
      "The restaurant with the given id was not found",
    );
  });

  it("should delete a restaurant", async () => {
    const restaurant: RestaurantEntity = restaurantList[0];
    await service.delete(restaurant.id);

    const deletedRestaurant = await repository.findOne({
      where: { id: restaurant.id },
    });
    expect(deletedRestaurant).toBeNull();
  });

  it("should throw an error when restaurant with given id is not found", async () => {
    await expect(service.delete("-1")).rejects.toHaveProperty(
      "message",
      "The restaurant with the given id was not found",
    );
  });
});
