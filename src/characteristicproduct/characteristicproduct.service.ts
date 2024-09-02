import { Injectable } from '@nestjs/common';
import { CharacteristicProductEntity } from './characteristicproduct.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

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
        'The product with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return product;
  }
  //Create a characteristic product
  async create(
    product: CharacteristicProductEntity,
  ): Promise<CharacteristicProductEntity> {
    return await this.characteristicproductRepository.save(product);
  }
  //Modify a characteristic product
  async update(
    id: string,
    product: CharacteristicProductEntity,
  ): Promise<CharacteristicProductEntity> {
    const persistedProduct: CharacteristicProductEntity =
      await this.characteristicproductRepository.findOne({ where: { id } });
    if (!persistedProduct) {
      throw new BusinessLogicException(
        'The product with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    return await this.characteristicproductRepository.save({
      ...persistedProduct,
      ...product,
    });
  }
  //Delete a characteristic product
  async delete(id: string) {
    const product: CharacteristicProductEntity =
      await this.characteristicproductRepository.findOne({ where: { id } });
    if (!product)
      throw new BusinessLogicException(
        'The product with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    await this.characteristicproductRepository.remove(product);
  }
}
