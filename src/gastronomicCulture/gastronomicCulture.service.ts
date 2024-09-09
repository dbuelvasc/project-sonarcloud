import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GastronomicCultureEntity } from './gastronomicCulture.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { CharacteristicProductEntity } from '../characteristicproduct/characteristicproduct.entity';

@Injectable()
export class GastronomicCultureService {
  constructor(
    @InjectRepository(GastronomicCultureEntity)
    private readonly gastronomicCultureRepository: Repository<GastronomicCultureEntity>,
    @InjectRepository(CharacteristicProductEntity)
    private readonly characteristicProductRepository: Repository<CharacteristicProductEntity>,
  ) {}

  async addCharacteristicProduct(
    gastronomicCultureId: string,
    characteristicProductId: string,
  ) {
    const gastronomicCulture = await this.gastronomicCultureRepository.findOne({
      where: { id: gastronomicCultureId },
      relations: {
        characteristicProducts: true,
      },
    });
    if (!gastronomicCulture) {
      throw new BusinessLogicException(
        'The gastronomic culture with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    const characteristicProduct =
      await this.characteristicProductRepository.findOne({
        where: { id: characteristicProductId },
      });
    if (!characteristicProduct) {
      throw new BusinessLogicException(
        'The characteristic product with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    gastronomicCulture.characteristicProducts = [
      ...gastronomicCulture.characteristicProducts,
      characteristicProduct,
    ];

    return this.gastronomicCultureRepository.save(gastronomicCulture);
  }
  async findAll(): Promise<GastronomicCultureEntity[]> {
    return this.gastronomicCultureRepository.find();
  }

  async findOne(id: string): Promise<GastronomicCultureEntity> {
    const gastronomicCulture = await this.gastronomicCultureRepository.findOne({
      where: { id },
    });
    if (!gastronomicCulture) {
      throw new BusinessLogicException(
        'The gastronomic culture with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    return gastronomicCulture;
  }

  async create(
    data: Partial<GastronomicCultureEntity>,
  ): Promise<GastronomicCultureEntity> {
    const gastronomicCulture = this.gastronomicCultureRepository.create(data);
    return this.gastronomicCultureRepository.save(gastronomicCulture);
  }

  async update(
    id: string,
    gastronomicCulture: GastronomicCultureEntity,
  ): Promise<GastronomicCultureEntity> {
    const persistedGastronomicCulture: GastronomicCultureEntity =
      await this.gastronomicCultureRepository.findOne({ where: { id } });
    if (!persistedGastronomicCulture) {
      throw new BusinessLogicException(
        'The gastronomic culture with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    return this.gastronomicCultureRepository.save({
      ...persistedGastronomicCulture,
      ...gastronomicCulture,
    });
  }

  async delete(id: string) {
    const gastronomicCulture = await this.gastronomicCultureRepository.findOne({
      where: { id },
    });
    if (!gastronomicCulture) {
      throw new BusinessLogicException(
        'The gastronomic culture with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    await this.gastronomicCultureRepository.remove(gastronomicCulture);
  }
}
