import { faker } from "@faker-js/faker";
import { CacheModule } from "@nestjs/cache-manager";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { RestaurantEntity } from "@/restaurant/restaurant.entity";
import { GastronomicCultureEntity } from "@/gastronomicCulture/gastronomicCulture.entity";
import { TypeOrmTestingConfig } from "@/shared/testing-utils/typeorm-testing-config";
import { GastronomicCultureRestaurantService } from "./gastronomicCulture-restaurant.service";

describe("GastronomicCultureRestaurantService", () => {
  let service: GastronomicCultureRestaurantService;
  let gastronomicCultureRepository: Repository<GastronomicCultureEntity>;
  let restaurantRepository: Repository<RestaurantEntity>;
  let gastronomicCulture: GastronomicCultureEntity;
  let restaurantsList: RestaurantEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig(), CacheModule.register()],
      providers: [GastronomicCultureRestaurantService],
    }).compile();

    service = module.get<GastronomicCultureRestaurantService>(
      GastronomicCultureRestaurantService,
    );
    gastronomicCultureRepository = module.get<
      Repository<GastronomicCultureEntity>
    >(getRepositoryToken(GastronomicCultureEntity));
    restaurantRepository = module.get<Repository<RestaurantEntity>>(
      getRepositoryToken(RestaurantEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    restaurantRepository.clear();
    gastronomicCultureRepository.clear();

    restaurantsList = [];
    for (let i = 0; i < 5; i++) {
      const restaurant: RestaurantEntity = await restaurantRepository.save({
        name: faker.company.name(),
        city: faker.location.city(),
        michelinStars: faker.number.int({ min: 1, max: 3 }),
        awardDate: faker.date.past(),
        gastronomicCulture: [],
      });
      restaurantsList.push(restaurant);
    }

    gastronomicCulture = await gastronomicCultureRepository.save({
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      restaurants: restaurantsList,
    });
  };

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should add a restaurant to a gastronomic culture", async () => {
    const newRestaurant: RestaurantEntity = await restaurantRepository.save({
      name: faker.company.name(),
      city: faker.location.city(),
      michelinStars: faker.number.int({ min: 1, max: 3 }),
      awardDate: faker.date.past(),
      gastronomicCulture: [],
    });

    const result: GastronomicCultureEntity =
      await service.addRestaurantToGastronomicCulture(
        gastronomicCulture.id,
        newRestaurant.id,
      );

    expect(result.restaurants.length).toBe(6);
    expect(result.restaurants[5]).not.toBeNull();
    expect(result.restaurants[5].name).toBe(newRestaurant.name);
  });

  it("should throw an exception for an invalid restaurant", async () => {
    await expect(
      service.addRestaurantToGastronomicCulture(gastronomicCulture.id, "0"),
    ).rejects.toHaveProperty(
      "message",
      "The characteristic product with the given id was not found",
    );
  });

  it("should throw an exception for an invalid gastronomic culture", async () => {
    const newRestaurant: RestaurantEntity = await restaurantRepository.save({
      name: faker.company.name(),
      city: faker.location.city(),
      michelinStars: faker.number.int({ min: 1, max: 3 }),
      awardDate: faker.date.past(),
      gastronomicCulture: [],
    });

    await expect(
      service.addRestaurantToGastronomicCulture("0", newRestaurant.id),
    ).rejects.toHaveProperty(
      "message",
      "The gastronomic culture with the given id was not found",
    );
  });

  it("should find restaurants from a gastronomic culture", async () => {
    const restaurants: RestaurantEntity[] =
      await service.findRestaurantsFromGastronomicCulture(
        gastronomicCulture.id,
      );
    expect(restaurants.length).toBe(5);
  });

  it("should throw an exception for an invalid gastronomic culture", async () => {
    await expect(
      service.findRestaurantsFromGastronomicCulture("0"),
    ).rejects.toHaveProperty(
      "message",
      "The gastronomic culture with the given id was not found",
    );
  });

  it("should find a restaurant from a gastronomic culture", async () => {
    const restaurant: RestaurantEntity = restaurantsList[0];
    const storedRestaurant: RestaurantEntity =
      await service.findRestaurantFromGastronomicCulture(
        gastronomicCulture.id,
        restaurant.id,
      );
    expect(storedRestaurant).not.toBeNull();
    expect(storedRestaurant.name).toBe(restaurant.name);
  });

  it("should throw an exception for an invalid restaurant", async () => {
    await expect(
      service.findRestaurantFromGastronomicCulture(gastronomicCulture.id, "0"),
    ).rejects.toHaveProperty(
      "message",
      "The characteristic product with the given id was not found",
    );
  });

  it("should throw an exception for an invalid gastronomic culture", async () => {
    const restaurant: RestaurantEntity = restaurantsList[0];
    await expect(
      service.findRestaurantFromGastronomicCulture("0", restaurant.id),
    ).rejects.toHaveProperty(
      "message",
      "The gastronomic culture with the given id was not found",
    );
  });

  it("should throw an exception for a restaurant not associated with the gastronomic culture", async () => {
    const newRestaurant: RestaurantEntity = await restaurantRepository.save({
      name: faker.company.name(),
      city: faker.location.city(),
      michelinStars: faker.number.int({ min: 1, max: 3 }),
      awardDate: faker.date.past(),
      gastronomicCulture: [],
    });

    await expect(
      service.findRestaurantFromGastronomicCulture(
        gastronomicCulture.id,
        newRestaurant.id,
      ),
    ).rejects.toHaveProperty(
      "message",
      "The characteristic product does not belong to the given gastronomic culture",
    );
  });

  it("should associate restaurants to a gastronomic culture", async () => {
    const newRestaurant: RestaurantEntity = await restaurantRepository.save({
      name: faker.company.name(),
      city: faker.location.city(),
      michelinStars: faker.number.int({ min: 1, max: 3 }),
      awardDate: faker.date.past(),
      gastronomicCulture: [],
    });

    const updatedGastronomicCulture: GastronomicCultureEntity =
      await service.associateRestaurantToGastronomicCulture(
        gastronomicCulture.id,
        [newRestaurant],
      );
    expect(updatedGastronomicCulture.restaurants.length).toBe(1);
    expect(updatedGastronomicCulture.restaurants[0].name).toBe(
      newRestaurant.name,
    );
  });

  it("should throw an exception for a non-existing restaurant", async () => {
    const newRestaurant: RestaurantEntity = restaurantsList[0];
    newRestaurant.id = "a00e7840-77aa-4065-964a-d9e216eaf076";

    await expect(
      service.associateRestaurantToGastronomicCulture(gastronomicCulture.id, [
        newRestaurant,
      ]),
    ).rejects.toHaveProperty(
      "message",
      "The characteristic product with the given id was not found",
    );
  });

  it("should throw an exception for an invalid gastronomic culture", async () => {
    const newRestaurant: RestaurantEntity = await restaurantRepository.save({
      name: faker.company.name(),
      city: faker.location.city(),
      michelinStars: faker.number.int({ min: 1, max: 3 }),
      awardDate: faker.date.past(),
      gastronomicCulture: [],
    });

    await expect(
      service.associateRestaurantToGastronomicCulture("0", [newRestaurant]),
    ).rejects.toHaveProperty(
      "message",
      "The gastronomic culture with the given id was not found",
    );
  });

  it("should delete a restaurant from a gastronomic culture", async () => {
    const restaurant: RestaurantEntity = restaurantsList[0];

    await service.deleteRestaurantFromGastronomicCulture(
      gastronomicCulture.id,
      restaurant.id,
    );

    const storedGastronomicCulture: GastronomicCultureEntity =
      await gastronomicCultureRepository.findOne({
        where: { id: gastronomicCulture.id },
        relations: ["restaurants"],
      });
    const deletedRestaurant = storedGastronomicCulture.restaurants.find(
      (c) => c.id === restaurant.id,
    );

    expect(deletedRestaurant).toBeUndefined();
  });

  it("should throw an exception for an invalid restaurant", async () => {
    await expect(
      service.deleteRestaurantFromGastronomicCulture(
        gastronomicCulture.id,
        "0",
      ),
    ).rejects.toHaveProperty(
      "message",
      "The characteristic product with the given id was not found",
    );
  });

  it("should throw an exception for an invalid gastronomic culture", async () => {
    const restaurant: RestaurantEntity = restaurantsList[0];
    await expect(
      service.deleteRestaurantFromGastronomicCulture("0", restaurant.id),
    ).rejects.toHaveProperty(
      "message",
      "The gastronomic culture with the given id was not found",
    );
  });

  it("should throw an exception for a non-associated restaurant", async () => {
    const newRestaurant: RestaurantEntity = await restaurantRepository.save({
      name: faker.company.name(),
      city: faker.location.city(),
      michelinStars: faker.number.int({ min: 1, max: 3 }),
      awardDate: faker.date.past(),
      gastronomicCulture: [],
    });

    await expect(
      service.deleteRestaurantFromGastronomicCulture(
        gastronomicCulture.id,
        newRestaurant.id,
      ),
    ).rejects.toHaveProperty(
      "message",
      "The characteristic product with the given id is not associated with the given gastronomic culture",
    );
  });

  it("should add a gastronomic culture to a restaurant", async () => {
    const newGastronomicCulture: GastronomicCultureEntity =
      await gastronomicCultureRepository.save({
        name: faker.company.name(),
        description: faker.lorem.sentence(),
      });

    const restaurant: RestaurantEntity = restaurantsList[0];
    const result: RestaurantEntity =
      await service.addGastronomicCultureToRestaurant(
        restaurant.id,
        newGastronomicCulture.id,
      );

    expect(result.gastronomicCultures.length).toBe(2);
    expect(result.gastronomicCultures[1]).not.toBeNull();
    expect(result.gastronomicCultures[1].name).toBe(newGastronomicCulture.name);
  });

  it("should throw an exception for an invalid restaurant", async () => {
    const newGastronomicCulture: GastronomicCultureEntity =
      await gastronomicCultureRepository.save({
        name: faker.company.name(),
        description: faker.lorem.sentence(),
      });

    await expect(
      service.addGastronomicCultureToRestaurant("0", newGastronomicCulture.id),
    ).rejects.toHaveProperty(
      "message",
      "The restaurant with the given id was not found",
    );
  });

  it("should throw an exception for an invalid gastronomic culture", async () => {
    const restaurant: RestaurantEntity = restaurantsList[0];

    await expect(
      service.addGastronomicCultureToRestaurant(restaurant.id, "0"),
    ).rejects.toHaveProperty(
      "message",
      "The gastronomic culture with the given id was not found",
    );
  });

  it("should find gastronomic cultures from a restaurant", async () => {
    const restaurant: RestaurantEntity = restaurantsList[0];
    const gastronomicCultures: GastronomicCultureEntity[] =
      await service.findGastronomicCulturesFromRestaurant(restaurant.id);
    expect(gastronomicCultures.length).toBe(1);
  });

  it("should throw an exception for an invalid restaurant", async () => {
    await expect(
      service.findGastronomicCulturesFromRestaurant("0"),
    ).rejects.toHaveProperty(
      "message",
      "The restaurant with the given id was not found",
    );
  });

  it("should find a gastronomic culture from a restaurant", async () => {
    const restaurant: RestaurantEntity = restaurantsList[0];
    const storedGastronomicCulture: GastronomicCultureEntity =
      await service.findGastronomicCultureFromRestaurant(
        restaurant.id,
        gastronomicCulture.id,
      );
    expect(storedGastronomicCulture).not.toBeNull();
    expect(storedGastronomicCulture.name).toBe(gastronomicCulture.name);
  });

  it("should throw an exception for an invalid gastronomic culture", async () => {
    const restaurant: RestaurantEntity = restaurantsList[0];
    await expect(
      service.findGastronomicCultureFromRestaurant(restaurant.id, "0"),
    ).rejects.toHaveProperty(
      "message",
      "The gastronomic culture with the given id was not found",
    );
  });

  it("should throw an exception for an invalid restaurant", async () => {
    await expect(
      service.findGastronomicCultureFromRestaurant("0", gastronomicCulture.id),
    ).rejects.toHaveProperty(
      "message",
      "The restaurant with the given id was not found",
    );
  });

  it("should throw an exception for a gastronomic culture not associated with the restaurant", async () => {
    const newGastronomicCulture: GastronomicCultureEntity =
      await gastronomicCultureRepository.save({
        name: faker.company.name(),
        description: faker.lorem.sentence(),
      });

    const restaurant: RestaurantEntity = restaurantsList[0];
    await expect(
      service.findGastronomicCultureFromRestaurant(
        restaurant.id,
        newGastronomicCulture.id,
      ),
    ).rejects.toHaveProperty(
      "message",
      "The gastronomic culture does not belong to the given restaurant",
    );
  });

  it("should associate gastronomic cultures to a restaurant", async () => {
    const newGastronomicCulture: GastronomicCultureEntity =
      await gastronomicCultureRepository.save({
        name: faker.company.name(),
        description: faker.lorem.sentence(),
      });

    const restaurant: RestaurantEntity = restaurantsList[0];
    const updatedRestaurant: RestaurantEntity =
      await service.associateGastronomicCulturesToRestaurant(restaurant.id, [
        newGastronomicCulture,
      ]);
    expect(updatedRestaurant.gastronomicCultures.length).toBe(1);
    expect(updatedRestaurant.gastronomicCultures[0].name).toBe(
      newGastronomicCulture.name,
    );
  });

  it("should throw an exception for a non-existing gastronomic culture", async () => {
    const newGastronomicCulture: GastronomicCultureEntity =
      await gastronomicCultureRepository.save({
        name: faker.company.name(),
        description: faker.lorem.sentence(),
      });
    newGastronomicCulture.id = "a00e7840-77aa-4065-964a-d9e216eaf076";

    const restaurant: RestaurantEntity = restaurantsList[0];
    await expect(
      service.associateGastronomicCulturesToRestaurant(restaurant.id, [
        newGastronomicCulture,
      ]),
    ).rejects.toHaveProperty(
      "message",
      "The gastronomic culture with the given id was not found",
    );
  });

  it("should throw an exception for an invalid restaurant", async () => {
    const newGastronomicCulture: GastronomicCultureEntity =
      await gastronomicCultureRepository.save({
        name: faker.company.name(),
        description: faker.lorem.sentence(),
      });

    await expect(
      service.associateGastronomicCulturesToRestaurant("0", [
        newGastronomicCulture,
      ]),
    ).rejects.toHaveProperty(
      "message",
      "The restaurant with the given id was not found",
    );
  });

  it("should delete a gastronomic culture from a restaurant", async () => {
    const restaurant: RestaurantEntity = restaurantsList[0];

    await service.deleteGastronomicCultureFromRestaurant(
      restaurant.id,
      gastronomicCulture.id,
    );

    const storedRestaurant: RestaurantEntity =
      await restaurantRepository.findOne({
        where: { id: restaurant.id },
        relations: ["gastronomicCultures"],
      });
    const deletedGastronomicCulture = storedRestaurant.gastronomicCultures.find(
      (gc) => gc.id === gastronomicCulture.id,
    );

    expect(deletedGastronomicCulture).toBeUndefined();
  });

  it("should throw an exception for an invalid gastronomic culture", async () => {
    const restaurant: RestaurantEntity = restaurantsList[0];
    await expect(
      service.deleteGastronomicCultureFromRestaurant(restaurant.id, "0"),
    ).rejects.toHaveProperty(
      "message",
      "The gastronomic culture with the given id was not found",
    );
  });

  it("should throw an exception for an invalid restaurant", async () => {
    await expect(
      service.deleteGastronomicCultureFromRestaurant(
        "0",
        gastronomicCulture.id,
      ),
    ).rejects.toHaveProperty(
      "message",
      "The restaurant with the given id was not found",
    );
  });

  it("should throw an exception for a non-associated gastronomic culture", async () => {
    const newGastronomicCulture: GastronomicCultureEntity =
      await gastronomicCultureRepository.save({
        name: faker.company.name(),
        description: faker.lorem.sentence(),
      });

    const restaurant: RestaurantEntity = restaurantsList[0];
    await expect(
      service.deleteGastronomicCultureFromRestaurant(
        restaurant.id,
        newGastronomicCulture.id,
      ),
    ).rejects.toHaveProperty(
      "message",
      "The gastronomic culture with the given id is not associated with the given restaurant",
    );
  });
});
