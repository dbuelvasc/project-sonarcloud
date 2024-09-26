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
        });
      gastronomicCultureList.push(gastronomicCulture);
    }

    characteristicProduct = await characteristicProductRepository.save({
      name: faker.word.verb(),
      category: faker.word.adjective(),
      description: faker.lorem.sentence(),
      history: faker.lorem.sentence(),
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

  it("should throw an error if the characteristic product is not found", async () => {
    const gastronomicCulture: GastronomicCultureEntity =
      await gastronomicCultureRepository.save({
        name: faker.word.verb(),
      });
    gastronomicCultureList.push(gastronomicCulture);

    const characteristicProductId = faker.string.uuid();

    await expect(
      service.addCharacteristicProductToGastronomicCulture(
        gastronomicCulture.id,
        characteristicProductId,
      ),
    ).rejects.toThrow(
      "The characteristic product with the given id was not found",
    );
  });

  it("should throw an error if the gastronomic culture is not found", async () => {
    await expect(
      service.addCharacteristicProductToGastronomicCulture(
        faker.string.uuid(),
        characteristicProduct.id,
      ),
    ).rejects.toThrow(
      "The gastronomic culture with the given id was not found",
    );
  });

  it("should find all characteristic products from a gastronomic culture", async () => {
    const gastronomicCulture: GastronomicCultureEntity =
      await gastronomicCultureRepository.save({
        name: faker.word.verb(),
      });
    gastronomicCultureList.push(gastronomicCulture);

    await service.addCharacteristicProductToGastronomicCulture(
      gastronomicCulture.id,
      characteristicProduct.id,
    );

    const characteristicProducts =
      await service.findCharacteristicProductsFromGastronomicCulture(
        gastronomicCulture.id,
      );

    expect(characteristicProducts).toHaveLength(1);
    expect(characteristicProducts[0].id).toEqual(characteristicProduct.id);
  });

  it("should throw an error if the gastronomic culture is not found", async () => {
    await expect(
      service.findCharacteristicProductsFromGastronomicCulture(
        faker.string.uuid(),
      ),
    ).rejects.toThrow(
      "The gastronomic culture with the given id was not found",
    );
  });

  it("should find a characteristic product from a gastronomic culture", async () => {
    const gastronomicCulture: GastronomicCultureEntity =
      await gastronomicCultureRepository.save({
        name: faker.word.verb(),
      });
    gastronomicCultureList.push(gastronomicCulture);

    const characteristicProduct: CharacteristicProductEntity =
      await characteristicProductRepository.save({
        name: faker.word.verb(),
        category: faker.word.adjective(),
        description: faker.lorem.sentence(),
        history: faker.lorem.sentence(),
      });

    await service.addCharacteristicProductToGastronomicCulture(
      gastronomicCulture.id,
      characteristicProduct.id,
    );

    const characteristicProductFromGastronomicCulture =
      await service.findCharacteristicProductFromGastronomicCulture(
        gastronomicCulture.id,
        characteristicProduct.id,
      );

    expect(characteristicProductFromGastronomicCulture.id).toEqual(
      characteristicProduct.id,
    );
  });

  it("should throw an error if the characteristic product is not found", async () => {
    const gastronomicCulture: GastronomicCultureEntity =
      await gastronomicCultureRepository.save({
        name: faker.word.verb(),
      });
    gastronomicCultureList.push(gastronomicCulture);

    const characteristicProductId = faker.string.uuid();

    await expect(
      service.findCharacteristicProductFromGastronomicCulture(
        gastronomicCulture.id,
        characteristicProductId,
      ),
    ).rejects.toThrow(
      "The characteristic product with the given id was not found",
    );
  });

  it("should throw an error if the gastronomic culture is not found", async () => {
    const characteristicProduct: CharacteristicProductEntity =
      await characteristicProductRepository.save({
        name: faker.word.verb(),
        category: faker.word.adjective(),
        description: faker.lorem.sentence(),
        history: faker.lorem.sentence(),
      });

    await expect(
      service.findCharacteristicProductFromGastronomicCulture(
        faker.string.uuid(),
        characteristicProduct.id,
      ),
    ).rejects.toThrow(
      "The gastronomic culture with the given id was not found",
    );
  });

  it("should throw an error if the characteristic product is not associated with the given gastronomic culture", async () => {
    const gastronomicCulture: GastronomicCultureEntity =
      await gastronomicCultureRepository.save({
        name: faker.word.verb(),
      });
    gastronomicCultureList.push(gastronomicCulture);

    const characteristicProduct: CharacteristicProductEntity =
      await characteristicProductRepository.save({
        name: faker.word.verb(),
        category: faker.word.adjective(),
        description: faker.lorem.sentence(),
        history: faker.lorem.sentence(),
      });

    await expect(
      service.findCharacteristicProductFromGastronomicCulture(
        gastronomicCulture.id,
        characteristicProduct.id,
      ),
    ).rejects.toThrow(
      "The characteristic product does not belong to the given gastronomic culture",
    );
  });

  it("should delete a characteristic product from a gastronomic culture", async () => {
    const gastronomicCulture: GastronomicCultureEntity =
      await gastronomicCultureRepository.save({
        name: faker.word.verb(),
      });
    gastronomicCultureList.push(gastronomicCulture);

    const characteristicProduct: CharacteristicProductEntity =
      await characteristicProductRepository.save({
        name: faker.word.verb(),
        category: faker.word.adjective(),
        description: faker.lorem.sentence(),
        history: faker.lorem.sentence(),
      });

    await service.addCharacteristicProductToGastronomicCulture(
      gastronomicCulture.id,
      characteristicProduct.id,
    );

    await service.deleteCharacteristicProductFromGastronomicCulture(
      gastronomicCulture.id,
      characteristicProduct.id,
    );

    const characteristicProducts =
      await service.findCharacteristicProductsFromGastronomicCulture(
        gastronomicCulture.id,
      );

    expect(characteristicProducts).toHaveLength(0);
  });

  it("should throw an error if the characteristic product is not associated with the given gastronomic culture", async () => {
    const gastronomicCulture: GastronomicCultureEntity =
      await gastronomicCultureRepository.save({
        name: faker.word.verb(),
      });
    gastronomicCultureList.push(gastronomicCulture);

    const characteristicProduct: CharacteristicProductEntity =
      await characteristicProductRepository.save({
        name: faker.word.verb(),
        category: faker.word.adjective(),
        description: faker.lorem.sentence(),
        history: faker.lorem.sentence(),
      });

    await expect(
      service.deleteCharacteristicProductFromGastronomicCulture(
        gastronomicCulture.id,
        characteristicProduct.id,
      ),
    ).rejects.toThrow(
      "The characteristic product with the given id is not associated with the given gastronomic culture",
    );
  });

  it("should throw an error if the gastronomic culture is not found", async () => {
    const characteristicProduct: CharacteristicProductEntity =
      await characteristicProductRepository.save({
        name: faker.word.verb(),
        category: faker.word.adjective(),
        description: faker.lorem.sentence(),
        history: faker.lorem.sentence(),
      });

    await expect(
      service.deleteCharacteristicProductFromGastronomicCulture(
        faker.string.uuid(),
        characteristicProduct.id,
      ),
    ).rejects.toThrow(
      "The gastronomic culture with the given id was not found",
    );
  });

  it("should throw an error if the characteristic product is not found", async () => {
    const gastronomicCulture: GastronomicCultureEntity =
      await gastronomicCultureRepository.save({
        name: faker.word.verb(),
      });
    gastronomicCultureList.push(gastronomicCulture);

    const characteristicProductId = faker.string.uuid();

    await expect
      service.deleteCharacteristicProductFromGastronomicCulture(
        gastronomicCulture.id,
        characteristicProductId,
      ),
    ).rejects.toThrow(
      "The characteristic product with the given id was not found",
    );
  });
});
