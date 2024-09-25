import { faker } from "@faker-js/faker";
import { CacheModule } from "@nestjs/cache-manager";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { CharacteristicProductEntity } from "@/characteristicProduct/characteristicProduct.entity";
import { GastronomicCultureEntity } from "@/gastronomicCulture/gastronomicCulture.entity";
import { TypeOrmTestingConfig } from "@/shared/testing-utils/typeorm-testing-config";
import { GastronomicCultureCharacteristicProductService } from "./gastronomicCulture-characteristicProduct.service";

describe("GastronomicCultureCharacteristicProductService", () => {
  let service: GastronomicCultureCharacteristicProductService;
  let gastronomicCultureRepository: Repository<GastronomicCultureEntity>;
  let characteristicProductRepository: Repository<CharacteristicProductEntity>;
  let gastronomicCultureList: GastronomicCultureEntity[];
  let characteristicProduct: CharacteristicProductEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig(), CacheModule.register()],
      providers: [GastronomicCultureCharacteristicProductService],
    }).compile();

    service = module.get<GastronomicCultureCharacteristicProductService>(
      GastronomicCultureCharacteristicProductService,
    );
    gastronomicCultureRepository = module.get<
      Repository<GastronomicCultureEntity>
    >(getRepositoryToken(GastronomicCultureEntity));

    characteristicProductRepository = module.get<
      Repository<CharacteristicProductEntity>
    >(getRepositoryToken(CharacteristicProductEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    gastronomicCultureRepository.clear();
    characteristicProductRepository.clear();
    gastronomicCultureList = [];
    for (let i = 0; i < 5; i++) {
      const gastronomicCulture: GastronomicCultureEntity =
        await gastronomicCultureRepository.save({
          name: faker.word.verb(),
          // characteristicProducts: [],
        });
      gastronomicCultureList.push(gastronomicCulture);
    }

    characteristicProduct = await characteristicProductRepository.save({
      name: faker.word.verb(),
      category: faker.word.adjective(),
      description: faker.lorem.sentence(),
      history: faker.lorem.sentence(),
      // gastronomicCulture: [],
    });
  };

  it("should add a characteristic product to a gastronomic culture", async () => {
    const gastronomicCulture: GastronomicCultureEntity =
      await gastronomicCultureRepository.save({
        name: faker.word.verb(),
      });
    gastronomicCultureList.push(gastronomicCulture);

    characteristicProduct = await characteristicProductRepository.save({
      name: faker.word.verb(),
      category: faker.word.adjective(),
      description: faker.lorem.sentence(),
      history: faker.lorem.sentence(),
      // gastronomicCulture: [],
    });

    const updatedGastronomicCulture =
      await service.addCharacteristicProductToGastronomicCulture(
        gastronomicCulture.id,
        characteristicProduct.id,
      );

    expect(updatedGastronomicCulture).not.toBeNull();
    expect(updatedGastronomicCulture.characteristicProducts).toHaveLength(1);
    expect(updatedGastronomicCulture.characteristicProducts[0].id).toEqual(
      characteristicProduct.id,
    );
  });
});
