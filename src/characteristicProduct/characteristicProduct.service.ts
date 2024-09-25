import { Injectable, Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToInstance } from "class-transformer";
import { Repository } from "typeorm";
import { CACHE_MANAGER, Cache } from "@nestjs/cache-manager";

import {
  BusinessError,
  BusinessLogicException,
} from "@/shared/errors/business-errors";
import { CharacteristicProductDto } from "./characteristicProduct.dto";
import { CharacteristicProductEntity } from "./characteristicProduct.entity";

@Injectable()
export class CharacteristicProductService {
  private readonly cacheKey = "characteristicProducts";

  constructor(
    @InjectRepository(CharacteristicProductEntity)
    private characteristicProductRepository: Repository<CharacteristicProductEntity>,

    @Inject(CACHE_MANAGER)
    private cacheService: Cache,
  ) {}
  //Find all characteristic products
  async findAll(): Promise<CharacteristicProductEntity[]> {
    const cached = await this.cacheService.get<CharacteristicProductEntity[]>(
      this.cacheKey,
    );
    if (!cached) {
      const products = await this.characteristicProductRepository.find();
      await this.cacheService.set(this.cacheKey, products);
      return products;
    }
    return cached;
  }
  //Find one characteristic product
  async findOne(id: string): Promise<CharacteristicProductEntity> {
    const product = await this.characteristicProductRepository.findOne({
      where: { id },
    });
    if (!product)
      throw new BusinessLogicException(
        "The product with the given id was not found",
        BusinessError.NOT_FOUND,
      );

    return product;
  }
  //Create a characteristic product
  async create(
    characteristicProductDto: CharacteristicProductDto,
  ): Promise<CharacteristicProductEntity> {
    const productInstance: CharacteristicProductEntity = plainToInstance(
      CharacteristicProductEntity,
      characteristicProductDto,
    );

    const product: CharacteristicProductEntity =
      this.characteristicProductRepository.create(productInstance);

    return await this.characteristicProductRepository.save(product);
  }
  //Modify a characteristic product
  async update(
    id: string,
    characteristicProductDto: CharacteristicProductDto,
  ): Promise<CharacteristicProductEntity> {
    const existingProduct = await this.characteristicProductRepository.findOne({
      where: { id },
    });

    if (!existingProduct) {
      throw new BusinessLogicException(
        "The product with the given id was not found",
        BusinessError.NOT_FOUND,
      );
    }

    const product: CharacteristicProductEntity = plainToInstance(
      CharacteristicProductEntity,
      characteristicProductDto,
    );
    return this.characteristicProductRepository.save({
      ...existingProduct,
      ...product,
    });
  }
  //Delete a characteristic product
  async delete(id: string) {
    const product = await this.characteristicProductRepository.findOne({
      where: { id },
    });
    if (!product)
      throw new BusinessLogicException(
        "The product with the given id was not found",
        BusinessError.NOT_FOUND,
      );

    await this.characteristicProductRepository.remove(product);
  }
}
