import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RestaurantEntity } from './restaurant.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(RestaurantEntity)
    private readonly restaurantRepository: Repository<RestaurantEntity>,
  ) {}

  private isValidUUID(id: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  }

  async findAll(): Promise<RestaurantEntity[]> {
    return this.restaurantRepository.find();
  }

  async findOne(id: string): Promise<RestaurantEntity> {
    // Verificar si el ID es un UUID válido
    if (!this.isValidUUID(id)) {
      throw new BusinessLogicException(
        'The restaurant with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    const restaurant = await this.restaurantRepository.findOne({
      where: { id },
    });
    if (!restaurant) {
      throw new BusinessLogicException(
        'The restaurant with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    return restaurant;
  }

  async create(data: Partial<RestaurantEntity>): Promise<RestaurantEntity> {
    const restaurant = this.restaurantRepository.create(data);
    return this.restaurantRepository.save(restaurant);
  }

  async update(
    id: string,
    restaurant: RestaurantEntity,
  ): Promise<RestaurantEntity> {
    // Verificar si el ID es un UUID válido
    if (!this.isValidUUID(id)) {
      throw new BusinessLogicException(
        'The restaurant with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    const PersitedRestaurant: RestaurantEntity =
      await this.restaurantRepository.findOne({ where: { id } });
    if (!PersitedRestaurant) {
      throw new BusinessLogicException(
        'The restaurant with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    return await this.restaurantRepository.save({
      ...PersitedRestaurant,
      ...restaurant,
    });
  }

  async delete(id: string): Promise<void> {
    // Verificar si el ID es un UUID válido
    if (!this.isValidUUID(id)) {
      throw new BusinessLogicException(
        'The restaurant with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    const restaurant: RestaurantEntity =
      await this.restaurantRepository.findOne({ where: { id } });
    if (!restaurant) {
      throw new BusinessLogicException(
        'The restaurant with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    await this.restaurantRepository.remove(restaurant);
  }
}
