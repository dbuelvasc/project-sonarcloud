import { faker } from "@faker-js/faker";
import { CacheModule } from "@nestjs/cache-manager";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { CountryEntity } from "@/country/country.entity";
import { GastronomicCultureEntity } from "@/gastronomicCulture/gastronomicCulture.entity";
import { TypeOrmTestingConfig } from "@/shared/testing-utils/typeorm-testing-config";
import { GastronomicCultureCountryService } from "./gastronomicCulture-country.service";

describe("GastronomicCultureCountryService", () => {
  let service: GastronomicCultureCountryService;
  let gastronomicCultureRepository: Repository<GastronomicCultureEntity>;
  let countryRepository: Repository<CountryEntity>;
  let gastronomicCulture: GastronomicCultureEntity;
  let countriesList: CountryEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig(), CacheModule.register()],
      providers: [GastronomicCultureCountryService],
    }).compile();

    service = module.get<GastronomicCultureCountryService>(
      GastronomicCultureCountryService,
    );
    gastronomicCultureRepository = module.get<
      Repository<GastronomicCultureEntity>
    >(getRepositoryToken(GastronomicCultureEntity));
    countryRepository = module.get<Repository<CountryEntity>>(
      getRepositoryToken(CountryEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    countryRepository.clear();
    gastronomicCultureRepository.clear();

    countriesList = [];
    for (let i = 0; i < 5; i++) {
      const country: CountryEntity = await countryRepository.save({
        name: faker.location.country(),
      });
      countriesList.push(country);
    }

    gastronomicCulture = await gastronomicCultureRepository.save({
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      countries: countriesList,
    });
  };

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should add a country to a gastronomic culture", async () => {
    const newCountry: CountryEntity = await countryRepository.save({
      name: faker.location.country(),
    });

    const result: GastronomicCultureEntity =
      await service.addCountryToGastronomicCulture(
        gastronomicCulture.id,
        newCountry.id,
      );

    expect(result.countries.length).toBe(6);
    expect(result.countries[5]).not.toBeNull();
    expect(result.countries[5].name).toBe(newCountry.name);
  });

  it("should throw an exception for an invalid country", async () => {
    await expect(
      service.addCountryToGastronomicCulture(gastronomicCulture.id, "0"),
    ).rejects.toHaveProperty(
      "message",
      "The characteristic product with the given id was not found",
    );
  });

  it("should throw an exception for an invalid gastronomic culture", async () => {
    const newCountry: CountryEntity = await countryRepository.save({
      name: faker.location.country(),
    });

    await expect(
      service.addCountryToGastronomicCulture("0", newCountry.id),
    ).rejects.toHaveProperty(
      "message",
      "The gastronomic culture with the given id was not found",
    );
  });

  it("should find countries from a gastronomic culture", async () => {
    const countries: CountryEntity[] =
      await service.findCountriesFromGastronomicCulture(gastronomicCulture.id);
    expect(countries.length).toBe(5);
  });

  it("should throw an exception for an invalid gastronomic culture", async () => {
    await expect(
      service.findCountriesFromGastronomicCulture("0"),
    ).rejects.toHaveProperty(
      "message",
      "The gastronomic culture with the given id was not found",
    );
  });

  it("should find a country from a gastronomic culture", async () => {
    const country: CountryEntity = countriesList[0];
    const storedCountry: CountryEntity =
      await service.findCountryFromGastronomicCulture(
        gastronomicCulture.id,
        country.id,
      );
    expect(storedCountry).not.toBeNull();
    expect(storedCountry.name).toBe(country.name);
  });

  it("should throw an exception for an invalid country", async () => {
    await expect(
      service.findCountryFromGastronomicCulture(gastronomicCulture.id, "0"),
    ).rejects.toHaveProperty(
      "message",
      "The characteristic product with the given id was not found",
    );
  });

  it("should throw an exception for an invalid gastronomic culture", async () => {
    const country: CountryEntity = countriesList[0];
    await expect(
      service.findCountryFromGastronomicCulture("0", country.id),
    ).rejects.toHaveProperty(
      "message",
      "The gastronomic culture with the given id was not found",
    );
  });

  it("should throw an exception for a country not associated with the gastronomic culture", async () => {
    const newCountry: CountryEntity = await countryRepository.save({
      name: faker.location.country(),
    });

    await expect(
      service.findCountryFromGastronomicCulture(
        gastronomicCulture.id,
        newCountry.id,
      ),
    ).rejects.toHaveProperty(
      "message",
      "The characteristic product does not belong to the given gastronomic culture",
    );
  });

  it("should associate countries to a gastronomic culture", async () => {
    const newCountry: CountryEntity = await countryRepository.save({
      name: faker.location.country(),
    });

    const updatedGastronomicCulture: GastronomicCultureEntity =
      await service.associateCountryToGastronomicCulture(
        gastronomicCulture.id,
        [newCountry],
      );
    expect(updatedGastronomicCulture.countries.length).toBe(1);
    expect(updatedGastronomicCulture.countries[0].name).toBe(newCountry.name);
  });

  it("should throw an exception for a non-existing country", async () => {
    const newCountry: CountryEntity = countriesList[0];
    newCountry.id = "a00e7840-77aa-4065-964a-d9e216eaf076";

    await expect(
      service.associateCountryToGastronomicCulture(gastronomicCulture.id, [
        newCountry,
      ]),
    ).rejects.toHaveProperty(
      "message",
      "The characteristic product with the given id was not found",
    );
  });

  it("should throw an exception for an invalid gastronomic culture", async () => {
    const newCountry: CountryEntity = await countryRepository.save({
      name: faker.location.country(),
    });

    await expect(
      service.associateCountryToGastronomicCulture("0", [newCountry]),
    ).rejects.toHaveProperty(
      "message",
      "The gastronomic culture with the given id was not found",
    );
  });

  it("should delete a country from a gastronomic culture", async () => {
    const country: CountryEntity = countriesList[0];

    await service.deleteCountryFromGastronomicCulture(
      gastronomicCulture.id,
      country.id,
    );

    const storedGastronomicCulture: GastronomicCultureEntity =
      await gastronomicCultureRepository.findOne({
        where: { id: gastronomicCulture.id },
        relations: ["countries"],
      });
    const deletedCountry = storedGastronomicCulture.countries.find(
      (c) => c.id === country.id,
    );

    expect(deletedCountry).toBeUndefined();
  });

  it("should throw an exception for an invalid country", async () => {
    await expect(
      service.deleteCountryFromGastronomicCulture(gastronomicCulture.id, "0"),
    ).rejects.toHaveProperty(
      "message",
      "The characteristic product with the given id was not found",
    );
  });

  it("should throw an exception for an invalid gastronomic culture", async () => {
    const country: CountryEntity = countriesList[0];
    await expect(
      service.deleteCountryFromGastronomicCulture("0", country.id),
    ).rejects.toHaveProperty(
      "message",
      "The gastronomic culture with the given id was not found",
    );
  });

  it("should throw an exception for a non-associated country", async () => {
    const newCountry: CountryEntity = await countryRepository.save({
      name: faker.location.country(),
    });

    await expect(
      service.deleteCountryFromGastronomicCulture(
        gastronomicCulture.id,
        newCountry.id,
      ),
    ).rejects.toHaveProperty(
      "message",
      "The characteristic product with the given id is not associated with the given gastronomic culture",
    );
  });

  it("should add a gastronomic culture to a country", async () => {
    const newGastronomicCulture: GastronomicCultureEntity =
      await gastronomicCultureRepository.save({
        name: faker.company.name(),
        description: faker.lorem.sentence(),
      });

    const country: CountryEntity = countriesList[0];
    const result: CountryEntity = await service.addGastronomicCultureToCountry(
      country.id,
      newGastronomicCulture.id,
    );

    expect(result.gastronomicCultures.length).toBe(2);
    expect(result.gastronomicCultures[1]).not.toBeNull();
    expect(result.gastronomicCultures[1].name).toBe(newGastronomicCulture.name);
  });

  it("should throw an exception for an invalid country", async () => {
    const newGastronomicCulture: GastronomicCultureEntity =
      await gastronomicCultureRepository.save({
        name: faker.company.name(),
        description: faker.lorem.sentence(),
      });

    await expect(
      service.addGastronomicCultureToCountry("0", newGastronomicCulture.id),
    ).rejects.toHaveProperty(
      "message",
      "The country with the given id was not found",
    );
  });

  it("should throw an exception for an invalid gastronomic culture", async () => {
    const country: CountryEntity = countriesList[0];

    await expect(
      service.addGastronomicCultureToCountry(country.id, "0"),
    ).rejects.toHaveProperty(
      "message",
      "The gastronomic culture with the given id was not found",
    );
  });

  it("should find gastronomic cultures from a country", async () => {
    const country: CountryEntity = countriesList[0];
    const gastronomicCultures: GastronomicCultureEntity[] =
      await service.findGastronomicCulturesFromCountry(country.id);
    expect(gastronomicCultures.length).toBe(1);
  });

  it("should throw an exception for an invalid country", async () => {
    await expect(
      service.findGastronomicCulturesFromCountry("0"),
    ).rejects.toHaveProperty(
      "message",
      "The country with the given id was not found",
    );
  });

  it("should find a gastronomic culture from a country", async () => {
    const country: CountryEntity = countriesList[0];
    const storedGastronomicCulture: GastronomicCultureEntity =
      await service.findGastronomicCultureFromCountry(
        country.id,
        gastronomicCulture.id,
      );
    expect(storedGastronomicCulture).not.toBeNull();
    expect(storedGastronomicCulture.name).toBe(gastronomicCulture.name);
  });

  it("should throw an exception for an invalid gastronomic culture", async () => {
    const country: CountryEntity = countriesList[0];
    await expect(
      service.findGastronomicCultureFromCountry(country.id, "0"),
    ).rejects.toHaveProperty(
      "message",
      "The gastronomic culture with the given id was not found",
    );
  });

  it("should throw an exception for an invalid country", async () => {
    await expect(
      service.findGastronomicCultureFromCountry("0", gastronomicCulture.id),
    ).rejects.toHaveProperty(
      "message",
      "The country with the given id was not found",
    );
  });

  it("should throw an exception for a gastronomic culture not associated with the country", async () => {
    const newGastronomicCulture: GastronomicCultureEntity =
      await gastronomicCultureRepository.save({
        name: faker.company.name(),
        description: faker.lorem.sentence(),
      });

    const country: CountryEntity = countriesList[0];
    await expect(
      service.findGastronomicCultureFromCountry(
        country.id,
        newGastronomicCulture.id,
      ),
    ).rejects.toHaveProperty(
      "message",
      "The gastronomic culture does not belong to the given country",
    );
  });

  it("should associate gastronomic cultures to a country", async () => {
    const newGastronomicCulture: GastronomicCultureEntity =
      await gastronomicCultureRepository.save({
        name: faker.company.name(),
        description: faker.lorem.sentence(),
      });

    const country: CountryEntity = countriesList[0];
    const updatedCountry: CountryEntity =
      await service.associateGastronomicCulturesToCountry(country.id, [
        newGastronomicCulture,
      ]);
    expect(updatedCountry.gastronomicCultures.length).toBe(1);
    expect(updatedCountry.gastronomicCultures[0].name).toBe(
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

    const country: CountryEntity = countriesList[0];
    await expect(
      service.associateGastronomicCulturesToCountry(country.id, [
        newGastronomicCulture,
      ]),
    ).rejects.toHaveProperty(
      "message",
      "The gastronomic culture with the given id was not found",
    );
  });

  it("should throw an exception for an invalid country", async () => {
    const newGastronomicCulture: GastronomicCultureEntity =
      await gastronomicCultureRepository.save({
        name: faker.company.name(),
        description: faker.lorem.sentence(),
      });

    await expect(
      service.associateGastronomicCulturesToCountry("0", [
        newGastronomicCulture,
      ]),
    ).rejects.toHaveProperty(
      "message",
      "The country with the given id was not found",
    );
  });

  it("should delete a gastronomic culture from a country", async () => {
    const country: CountryEntity = countriesList[0];

    await service.deleteGastronomicCultureFromCountry(
      country.id,
      gastronomicCulture.id,
    );

    const storedCountry: CountryEntity = await countryRepository.findOne({
      where: { id: country.id },
      relations: ["gastronomicCultures"],
    });
    const deletedGastronomicCulture = storedCountry.gastronomicCultures.find(
      (gc) => gc.id === gastronomicCulture.id,
    );

    expect(deletedGastronomicCulture).toBeUndefined();
  });

  it("should throw an exception for an invalid gastronomic culture", async () => {
    const country: CountryEntity = countriesList[0];
    await expect(
      service.deleteGastronomicCultureFromCountry(country.id, "0"),
    ).rejects.toHaveProperty(
      "message",
      "The gastronomic culture with the given id was not found",
    );
  });

  it("should throw an exception for an invalid country", async () => {
    await expect(
      service.deleteGastronomicCultureFromCountry("0", gastronomicCulture.id),
    ).rejects.toHaveProperty(
      "message",
      "The country with the given id was not found",
    );
  });

  it("should throw an exception for a non-associated gastronomic culture", async () => {
    const newGastronomicCulture: GastronomicCultureEntity =
      await gastronomicCultureRepository.save({
        name: faker.company.name(),
        description: faker.lorem.sentence(),
      });

    const country: CountryEntity = countriesList[0];
    await expect(
      service.deleteGastronomicCultureFromCountry(
        country.id,
        newGastronomicCulture.id,
      ),
    ).rejects.toHaveProperty(
      "message",
      "The gastronomic culture with the given id is not associated with the given country",
    );
  });
});
