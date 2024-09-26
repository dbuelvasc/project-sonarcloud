import { faker } from "@faker-js/faker";
import { CacheModule } from "@nestjs/cache-manager";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { CountryEntity } from "@/country/country.entity";
import { RestaurantEntity } from "@/restaurant/restaurant.entity";
import { TypeOrmTestingConfig } from "@/shared/testing-utils/typeorm-testing-config";
import { CountryRestaurantService } from "./country-restaurant.service";

describe("CountryRestaurantService", () => {
  let service: CountryRestaurantService;
  let countryRepository: Repository<CountryEntity>;
  let restaurantRepository: Repository<RestaurantEntity>;
  let country: CountryEntity;
  let restaurantsList: RestaurantEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig(), CacheModule.register()],
      providers: [CountryRestaurantService],
    }).compile();

    service = module.get<CountryRestaurantService>(CountryRestaurantService);
    countryRepository = module.get<Repository<CountryEntity>>(
      getRepositoryToken(CountryEntity),
    );
    restaurantRepository = module.get<Repository<RestaurantEntity>>(
      getRepositoryToken(RestaurantEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    restaurantRepository.clear();
    countryRepository.clear();

    restaurantsList = [];
    for (let i = 0; i < 5; i++) {
      const restaurant: RestaurantEntity = await restaurantRepository.save({
        name: faker.company.name(),
        city: faker.location.city(),
        michelinStars: faker.number.int({ min: 1, max: 5 }),
        awardDate: faker.date.past(),
      });
      restaurantsList.push(restaurant);
    }

    country = await countryRepository.save({
      name: faker.location.country(),
      restaurants: restaurantsList,
    });
  };

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("addRestaurantToCountry should add a restaurant to a country", async () => {
    const newRestaurant: RestaurantEntity = await restaurantRepository.save({
      name: faker.company.name(),
      city: faker.location.city(),
      michelinStars: faker.number.int({ min: 1, max: 5 }),
      awardDate: faker.date.past(),
    });

    const result: CountryEntity = await service.addRestaurantToCountry(
      country.id,
      newRestaurant.id,
    );

    expect(result.restaurants.length).toBe(6);
    expect(result.restaurants[5]).not.toBeNull();
  });

  it("addRestaurantToCountry should throw an exception for an invalid restaurant", async () => {
    await expect(
      service.addRestaurantToCountry(country.id, "0"),
    ).rejects.toHaveProperty(
      "message",
      "The restaurant with the given id was not found",
    );
  });

  it("addRestaurantToCountry should throw an exception for an invalid country", async () => {
    const newRestaurant: RestaurantEntity = await restaurantRepository.save({
      name: faker.company.name(),
      city: faker.location.city(),
      michelinStars: faker.number.int({ min: 1, max: 5 }),
      awardDate: faker.date.past(),
    });

    await expect(
      service.addRestaurantToCountry("0", newRestaurant.id),
    ).rejects.toHaveProperty(
      "message",
      "The country with the given id was not found",
    );
  });

  it("findRestaurantFromCountry should return restaurant by country", async () => {
    const restaurant: RestaurantEntity = restaurantsList[0];
    const storedRestaurant: RestaurantEntity =
      await service.findRestaurantFromCountry(country.id, restaurant.id);
    expect(storedRestaurant).not.toBeNull();
    expect(storedRestaurant.name).toBe(restaurant.name);
    expect(storedRestaurant.city).toBe(restaurant.city);
  });

  it("findRestaurantFromCountry should throw an exception for an invalid restaurant", async () => {
    await expect(
      service.findRestaurantFromCountry(country.id, "0"),
    ).rejects.toHaveProperty(
      "message",
      "The restaurant with the given id was not found",
    );
  });

  it("findRestaurantFromCountry should throw an exception for an invalid country", async () => {
    const restaurant: RestaurantEntity = restaurantsList[0];
    await expect(
      service.findRestaurantFromCountry("0", restaurant.id),
    ).rejects.toHaveProperty(
      "message",
      "The country with the given id was not found",
    );
  });

  it("findRestaurantFromCountry should throw an exception for a restaurant not associated to the country", async () => {
    const newRestaurant: RestaurantEntity = await restaurantRepository.save({
      name: faker.company.name(),
      city: faker.location.city(),
      michelinStars: faker.number.int({ min: 1, max: 5 }),
      awardDate: faker.date.past(),
    });

    await expect(
      service.findRestaurantFromCountry(country.id, newRestaurant.id),
    ).rejects.toHaveProperty(
      "message",
      "The restaurant does not belong to the given country",
    );
  });

  it("findRestaurantsFromCountry should return restaurants by country", async () => {
    const restaurants: RestaurantEntity[] =
      await service.findRestaurantsFromCountry(country.id);
    expect(restaurants.length).toBe(5);
  });

  it("findRestaurantsFromCountry should throw an exception for an invalid country", async () => {
    await expect(
      service.findRestaurantsFromCountry("0"),
    ).rejects.toHaveProperty(
      "message",
      "The country with the given id was not found",
    );
  });

  it("associateRestaurantsToCountry should update restaurants list for a country", async () => {
    const newRestaurant: RestaurantEntity = await restaurantRepository.save({
      name: faker.company.name(),
      city: faker.location.city(),
      michelinStars: faker.number.int({ min: 1, max: 5 }),
      awardDate: faker.date.past(),
    });

    const updatedCountry: CountryEntity =
      await service.associateRestaurantsToCountry(country.id, [newRestaurant]);
    expect(updatedCountry.restaurants.length).toBe(1);
    expect(updatedCountry.restaurants[0].name).toBe(newRestaurant.name);
    expect(updatedCountry.restaurants[0].city).toBe(newRestaurant.city);
  });

  it("associateRestaurantsToCountry should throw an exception for non existing restaurant", async () => {
    const newRestaurant: RestaurantEntity = await restaurantRepository.save({
      name: faker.company.name(),
      city: faker.location.city(),
      michelinStars: faker.number.int({ min: 1, max: 5 }),
      awardDate: faker.date.past(),
    });

    newRestaurant.id = "a00e7840-77aa-4065-964a-d9e216eaf076";

    await expect(
      service.associateRestaurantsToCountry(country.id, [newRestaurant]),
    ).rejects.toHaveProperty(
      "message",
      "The restaurant with the given id was not found",
    );
  });

  it("associateRestaurantsToCountry should throw an exception for an invalid country", async () => {
    const newRestaurant: RestaurantEntity = await restaurantRepository.save({
      name: faker.company.name(),
      city: faker.location.city(),
      michelinStars: faker.number.int({ min: 1, max: 5 }),
      awardDate: faker.date.past(),
    });

    await expect(
      service.associateRestaurantsToCountry("0", [newRestaurant]),
    ).rejects.toHaveProperty(
      "message",
      "The country with the given id was not found",
    );
  });

  it("deleteRestaurantFromCountry should remove a restaurant from a country", async () => {
    const restaurant: RestaurantEntity = restaurantsList[0];

    await service.deleteRestaurantFromCountry(country.id, restaurant.id);

    const storedCountry: CountryEntity = await countryRepository.findOne({
      where: { id: country.id },
      relations: ["restaurants"],
    });
    const deletedRestaurant = storedCountry.restaurants.find(
      (r) => r.id === restaurant.id,
    );

    expect(deletedRestaurant).toBeUndefined();
  });

  it("deleteRestaurantFromCountry should throw an exception for an invalid restaurant", async () => {
    await expect(
      service.deleteRestaurantFromCountry(country.id, "0"),
    ).rejects.toHaveProperty(
      "message",
      "The restaurant with the given id was not found",
    );
  });

  it("deleteRestaurantFromCountry should throw an exception for an invalid country", async () => {
    const restaurant: RestaurantEntity = restaurantsList[0];
    await expect(
      service.deleteRestaurantFromCountry("0", restaurant.id),
    ).rejects.toHaveProperty(
      "message",
      "The country with the given id was not found",
    );
  });

  it("deleteRestaurantFromCountry should throw an exception for a non associated restaurant", async () => {
    const newRestaurant: RestaurantEntity = await restaurantRepository.save({
      name: faker.company.name(),
      city: faker.location.city(),
      michelinStars: faker.number.int({ min: 1, max: 5 }),
      awardDate: faker.date.past(),
    });

    await expect(
      service.deleteRestaurantFromCountry(country.id, newRestaurant.id),
    ).rejects.toHaveProperty(
      "message",
      "The restaurant with the given id is not associated with the given country",
    );
  });
});
