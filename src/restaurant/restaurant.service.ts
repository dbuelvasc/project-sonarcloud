import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import { Cache } from "cache-manager";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToInstance } from "class-transformer";
import { Repository } from "typeorm";

import {
  BusinessError,
  BusinessLogicException,
} from "@/shared/errors/business-errors";
import { RestaurantDto } from "./restaurant.dto";
import { RestaurantEntity } from "./restaurant.entity";

@Injectable()
export class RestaurantService {
  cacheKey = 'restaurants';

  constructor(
    @InjectRepository(RestaurantEntity)
    private readonly restaurantRepository: Repository<RestaurantEntity>,

    @Inject(CACHE_MANAGER)
       private readonly cacheManager: Cache
  ) {}

  async findAll(): Promise<RestaurantEntity[]> {
    const cachedRestaurants: RestaurantEntity[] | undefined = await this.cacheManager.get<RestaurantEntity[]>(this.cacheKey);
    if (!cachedRestaurants) {
      const restaurants = await this.restaurantRepository.find({
        relations: ['gastronomicCulture']
      });
      await this.cacheManager.set(this.cacheKey, restaurants);
      return restaurants;
    }
  }

  async findOne(id: string): Promise<RestaurantEntity> {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id },
    });
    if (!restaurant) {
      throw new BusinessLogicException(
        "The restaurant with the given id was not found",
        BusinessError.NOT_FOUND,
      );
    }
    return restaurant;
  }

  async create(restaurantDto: RestaurantDto): Promise<RestaurantEntity> {
    const restaurantInstance = plainToInstance(RestaurantEntity, restaurantDto);

    const restaurant: RestaurantEntity =
      this.restaurantRepository.create(restaurantInstance);

    return this.restaurantRepository.save(restaurant);
  }

  async update(
    id: string,
    restaurantDto: RestaurantDto,
  ): Promise<RestaurantEntity> {
    const existingRestaurant = await this.restaurantRepository.findOne({
      where: { id },
    });
    if (!existingRestaurant) {
      throw new BusinessLogicException(
        "The restaurant with the given id was not found",
        BusinessError.NOT_FOUND,
      );
    }

    const restaurant: RestaurantEntity = plainToInstance(
      RestaurantEntity,
      restaurantDto,
    );

    return this.restaurantRepository.save({
      ...existingRestaurant,
      ...restaurant,
    });
  }

  async delete(id: string): Promise<void> {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id },
    });
    if (!restaurant) {
      throw new BusinessLogicException(
        "The restaurant with the given id was not found",
        BusinessError.NOT_FOUND,
      );
    }
    await this.restaurantRepository.remove(restaurant);
  }
}
