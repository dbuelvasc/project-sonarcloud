import { Injectable } from "@nestjs/common";
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
  constructor(
    @InjectRepository(CharacteristicProductEntity)
    private characteristicproductRepository: Repository<CharacteristicProductEntity>,
  ) {}
  //Find all characteristic products
  async findAll(): Promise<CharacteristicProductEntity[]> {
    return await this.characteristicproductRepository.find();
  }
  //Find one characteristic product
  async findOne(id: string): Promise<CharacteristicProductEntity> {
    const product: CharacteristicProductEntity =
      await this.characteristicproductRepository.findOne({ where: { id } });
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
    const existingProduct: CharacteristicProductEntity =
      await this.characteristicproductRepository.findOne({ where: { id } });

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
    const product: CharacteristicProductEntity =
      await this.characteristicproductRepository.findOne({ where: { id } });
    if (!product)
      throw new BusinessLogicException(
        "The product with the given id was not found",
        BusinessError.NOT_FOUND,
      );

    await this.characteristicproductRepository.remove(product);
  }
}
