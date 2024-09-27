import { faker } from "@faker-js/faker";
import { CacheModule } from "@nestjs/cache-manager";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { TypeOrmTestingConfig } from "@/shared/testing-utils/typeorm-testing-config";
import { CountryEntity } from "./country.entity";
import { CountryService } from "./country.service";

describe("CountryService", () => {
  let service: CountryService;
  let repository: Repository<CountryEntity>;
  let countriesList: CountryEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig(), CacheModule.register()],
      providers: [CountryService],
    }).compile();

    service = module.get<CountryService>(CountryService);
    repository = module.get<Repository<CountryEntity>>(
      getRepositoryToken(CountryEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    countriesList = [];
    for (let i = 0; i < 5; i++) {
      const country: CountryEntity = await repository.save({
        name: faker.location.country(),
        restaurants: [],
        gastronomicCultures: [],
      });
      countriesList.push(country);
    }
  };

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should return all countries", async () => {
    const countries: CountryEntity[] = await service.findAll();
    expect(countries).not.toBeNull();
    expect(countries).toHaveLength(countriesList.length);
  });

  it("should return a single country", async () => {
    const storedCountry: CountryEntity = countriesList[0];
    const country: CountryEntity = await service.findOne(storedCountry.id);
    expect(country).not.toBeNull();
    expect(country.name).toEqual(storedCountry.name);
  });

  it("should throw an exception for an invalid country", async () => {
    await expect(service.findOne("0")).rejects.toHaveProperty(
      "message",
      "The country with the given id was not found",
    );
  });

  it("should create a new country", async () => {
    const country: CountryEntity = {
      id: "",
      name: faker.location.country(),
      restaurants: [],
      gastronomicCultures: [],
    };

    const newCountry: CountryEntity = await service.create(country);
    expect(newCountry).not.toBeNull();

    const storedCountry = await repository.findOne({
      where: { id: newCountry.id },
    });
    expect(storedCountry).not.toBeNull();
    expect(storedCountry.name).toEqual(newCountry.name);
  });

  it("should update a country", async () => {
    const country: CountryEntity = countriesList[0];
    country.name = "Wonderland";
    const updatedCountry: CountryEntity = await service.update(
      country.id,
      country,
    );
    expect(updatedCountry).not.toBeNull();
    const storedCountry = await repository.findOne({
      where: { id: country.id },
    });
    expect(storedCountry).not.toBeNull();
    expect(storedCountry.name).toEqual(country.name);
  });

  it("should throw an exception for an invalid country", async () => {
    let country: CountryEntity = countriesList[0];
    country = {
      ...country,
      name: "Wonderland 2",
    };
    await expect(service.update("0", country)).rejects.toHaveProperty(
      "message",
      "The country with the given id was not found",
    );
  });

  it("should delete a country", async () => {
    const country: CountryEntity = countriesList[0];
    await service.delete(country.id);
    const deletedCountry = await repository.findOne({
      where: { id: country.id },
    });
    expect(deletedCountry).toBeNull();
  });

  it("should throw an exception for an invalid country", async () => {
    await expect(service.delete("0")).rejects.toHaveProperty(
      "message",
      "The country with the given id was not found",
    );
  });
});
