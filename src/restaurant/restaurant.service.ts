import { Injectable } from "@nestjs/common";
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
  constructor(
    @InjectRepository(RestaurantEntity)
    private readonly restaurantRepository: Repository<RestaurantEntity>,
  ) {}

  async findAll(): Promise<RestaurantEntity[]> {
    return this.restaurantRepository.find();
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
    const existingRestaurant: RestaurantEntity =
      await this.restaurantRepository.findOne({ where: { id } });
    if (!existingRestaurant) {
      throw new BusinessLogicException(
        "The restaurant with the given id was not found",
        BusinessError.NOT_FOUND,
      );
    }
    return await this.restaurantRepository.save({
      ...existingRestaurant,
      ...restaurantDto,
    });
  }

  async delete(id: string): Promise<void> {
    const restaurant: RestaurantEntity =
      await this.restaurantRepository.findOne({ where: { id } });
    if (!restaurant) {
      throw new BusinessLogicException(
        "The restaurant with the given id was not found",
        BusinessError.NOT_FOUND,
      );
    }
    await this.restaurantRepository.remove(restaurant);
  }
}
