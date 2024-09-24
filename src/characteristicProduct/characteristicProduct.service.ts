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
  private readonly cacheKey = 'characteristicProducts';

  constructor(
    @InjectRepository(CharacteristicProductEntity)
    private characteristicproductRepository: Repository<CharacteristicProductEntity>,

    @Inject(CACHE_MANAGER)
    private cacheService: Cache
  ) {}
  //Find all characteristic products
  async findAll(): Promise<CharacteristicProductEntity[]> {
    const cached = await this.cacheService.get<CharacteristicProductEntity[]>(this.cacheKey);
    if (!cached) {
      const products = await this.characteristicproductRepository.find();
      await this.cacheService.set(this.cacheKey, products);
      return products;
    }
    return cached;
  }
  //Find one characteristic product
  async findOne(id: string): Promise<CharacteristicProductEntity> {
    const product = await this.characteristicproductRepository.findOne({
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
    characteristicproductDto: CharacteristicProductDto,
  ): Promise<CharacteristicProductEntity> {
    const productInstance: CharacteristicProductEntity = plainToInstance(
      CharacteristicProductEntity,
      characteristicproductDto,
    );

    const product: CharacteristicProductEntity =
      this.characteristicproductRepository.create(productInstance);

    return await this.characteristicproductRepository.save(product);
  }
  //Modify a characteristic product
  async update(
    id: string,
    characteristicproductDto: CharacteristicProductDto,
  ): Promise<CharacteristicProductEntity> {
    const existingProduct = await this.characteristicproductRepository.findOne({
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
      characteristicproductDto,
    );
    return this.characteristicproductRepository.save({
      ...existingProduct,
      ...product,
    });
  }
  //Delete a characteristic product
  async delete(id: string) {
    const product = await this.characteristicproductRepository.findOne({
      where: { id },
    });
    if (!product)
      throw new BusinessLogicException(
        "The product with the given id was not found",
        BusinessError.NOT_FOUND,
      );

    await this.characteristicproductRepository.remove(product);
  }
}
