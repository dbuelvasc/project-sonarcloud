import { Injectable } from '@nestjs/common';
import { CharacteristicproductEntity } from './characteristicproduct.entity/characteristicproduct.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessLogicException } from '../shared/errors/business-errors';
import { BusinessError } from '../shared/errors/business-errors';

@Injectable()
export class CharacteristicproductService {
  constructor(
    @InjectRepository(CharacteristicproductEntity)
    private characteristicproductRepository: Repository<CharacteristicproductEntity>,
  ) {}
  //Find all characteristic products
  async findAll(): Promise<CharacteristicproductEntity[]> {
    return await this.characteristicproductRepository.find();
  }
  //Find one characteristic product
  async findOne(id: string): Promise<CharacteristicproductEntity> {
    const product: CharacteristicproductEntity =
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
    product: CharacteristicproductEntity,
  ): Promise<CharacteristicproductEntity> {
    return await this.characteristicproductRepository.save(product);
  }
  //Modify a characteristic product
  async update(
    id: string,
    product: CharacteristicproductEntity,
  ): Promise<CharacteristicproductEntity> {
    const persistedProduct: CharacteristicproductEntity =
      await this.characteristicproductRepository.findOne({ where: { id } });
    if (!persistedProduct)
      throw new BusinessLogicException(
        'The product with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return await this.characteristicproductRepository.save({
      ...persistedProduct,
      ...product,
    });
  }
  //Delete a characteristic product
  async delete(id: string) {
    const product: CharacteristicproductEntity =
      await this.characteristicproductRepository.findOne({ where: { id } });
    if (!product)
      throw new BusinessLogicException(
        'The product with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    await this.characteristicproductRepository.remove(product);
  }
}
