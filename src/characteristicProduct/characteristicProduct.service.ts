import { CACHE_MANAGER, Cache } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToInstance } from "class-transformer";
import { Repository } from "typeorm";

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
    private readonly cacheService: Cache,
  ) {}

  async findAll(
    includeRelations: boolean = false,
  ): Promise<CharacteristicProductEntity[]> {
    const cachedProducts = await this.cacheService.get<
      CharacteristicProductEntity[]
    >(this.cacheKey);

    if (cachedProducts) {
      return cachedProducts;
    }

    const products = await this.characteristicProductRepository.find({
      relations: {
        gastronomicCulture: includeRelations,
      },
    });
    await this.cacheService.set(this.cacheKey, products);
    return products;
  }

  async findOne(
    id: string,
    includeRelations: boolean = false,
  ): Promise<CharacteristicProductEntity> {
    const product = await this.characteristicProductRepository.findOne({
      where: { id },
      relations: {
        gastronomicCulture: includeRelations,
      },
    });
    if (!product)
      throw new BusinessLogicException(
        "The product with the given id was not found",
        BusinessError.NOT_FOUND,
      );

    return product;
  }

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
