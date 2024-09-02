import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GastronomicCultureEntity } from './gastronomic-culture.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class GastronomicCultureService {
  constructor(
    @InjectRepository(GastronomicCultureEntity)
    private readonly gastronomicCultureRepository: Repository<GastronomicCultureEntity>,
  ) {}

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
