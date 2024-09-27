import { faker } from "@faker-js/faker";
import { CacheModule } from "@nestjs/cache-manager";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { TypeOrmTestingConfig } from "@/shared/testing-utils/typeorm-testing-config";
import { CharacteristicProductEntity } from "./characteristicProduct.entity";
import { CharacteristicProductService } from "./characteristicProduct.service";

describe("CharacteristicProductService", () => {
  let service: CharacteristicProductService;
  let repository: Repository<CharacteristicProductEntity>;
  let productsList: CharacteristicProductEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig(), CacheModule.register()],
      providers: [CharacteristicProductService],
    }).compile();

    service = module.get<CharacteristicProductService>(
      CharacteristicProductService,
    );
    repository = module.get<Repository<CharacteristicProductEntity>>(
      getRepositoryToken(CharacteristicProductEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    productsList = [];
    for (let i = 0; i < 5; i++) {
      const product: CharacteristicProductEntity = await repository.save({
        name: faker.word.noun(),
        description: faker.lorem.paragraph(),
        history: faker.lorem.paragraphs(2),
        category: faker.word.noun(),
      });
      productsList.push(product);
    }
  };

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should return all products", async () => {
    const products: CharacteristicProductEntity[] = await service.findAll();
    expect(products).not.toBeNull();
    expect(products).toHaveLength(productsList.length);
  });

  it("should return a single product", async () => {
    const storedProduct: CharacteristicProductEntity = productsList[0];
    const product: CharacteristicProductEntity = await service.findOne(
      storedProduct.id,
    );
    expect(product).not.toBeNull();
    expect(product.name).toEqual(storedProduct.name);
    expect(product.description).toEqual(storedProduct.description);
    expect(product.history).toEqual(storedProduct.history);
  });

  it("should throw an exception for an invalid product", async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty(
      "message",
      "The product with the given id was not found",
    );
  });

  it("should create a new product", async () => {
    const product = {
      id: "0",
      name: faker.word.noun(),
      description: faker.lorem.paragraph(),
      history: faker.lorem.paragraphs(2),
      category: faker.word.noun(),
    };

    const newProduct: CharacteristicProductEntity =
      await service.create(product);
    expect(newProduct).not.toBeNull();

    const storedProduct = await repository.findOne({
      where: { id: newProduct.id },
    });
    expect(storedProduct).not.toBeNull();
    expect(storedProduct.name).toEqual(newProduct.name);
    expect(storedProduct.description).toEqual(newProduct.description);
    expect(storedProduct.history).toEqual(newProduct.history);
  });

  it("should update a product", async () => {
    const product: CharacteristicProductEntity = productsList[0];
    product.name = "Wonderland";
    product.description = "A wonderfull place";
    product.history = "The rabbit created with magic and imagination";
    const updatedProduct: CharacteristicProductEntity = await service.update(
      product.id,
      product,
    );
    expect(updatedProduct).not.toBeNull();
    const storedProduct = await repository.findOne({
      where: { id: product.id },
    });
    expect(storedProduct).not.toBeNull();
    expect(storedProduct.name).toEqual(product.name);
    expect(storedProduct.description).toEqual(product.description);
    expect(storedProduct.history).toEqual(product.history);
  });

  it("should throw an exception for an invalid product", async () => {
    let product: CharacteristicProductEntity = productsList[0];
    product = {
      ...product,
      name: "Wonderland 2",
      description: "Another magic place",
      history: "This was created by the queen of hearts",
    };
    await expect(() => service.update("0", product)).rejects.toHaveProperty(
      "message",
      "The product with the given id was not found",
    );
  });

  it("should delete a product", async () => {
    const product: CharacteristicProductEntity = productsList[0];
    await service.delete(product.id);
    const deletedProduct = await repository.findOne({
      where: { id: product.id },
    });
    expect(deletedProduct).toBeNull();
  });

  it("should throw an exception for an invalid product", async () => {
    await expect(() => service.delete("0")).rejects.toHaveProperty(
      "message",
      "The product with the given id was not found",
    );
  });
});
