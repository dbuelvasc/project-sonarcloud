import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Cache } from "cache-manager";
import { plainToInstance } from "class-transformer";
import { Repository } from "typeorm";

import { RestaurantDto } from "@/restaurant/restaurant.dto";
import { RestaurantEntity } from "@/restaurant/restaurant.entity";
import { GastronomicCultureDto } from "@/gastronomicCulture/gastronomicCulture.dto";
import { GastronomicCultureEntity } from "@/gastronomicCulture/gastronomicCulture.entity";
import {
  BusinessError,
  BusinessLogicException,
} from "@/shared/errors/business-errors";

@Injectable()
export class GastronomicCultureRestaurantService {
  baseCacheKey = "gastronomicCulture-characteristicProduct";

  constructor(
    @InjectRepository(GastronomicCultureEntity)
    private readonly gastronomicCultureRepository: Repository<GastronomicCultureEntity>,
    @InjectRepository(RestaurantEntity)
    private readonly restaurantRepository: Repository<RestaurantEntity>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async addRestaurantToGastronomicCulture(
    gastronomicCultureId: string,
    restaurantId: string,
  ) {
    const gastronomicCulture = await this.gastronomicCultureRepository.findOne({
      where: { id: gastronomicCultureId },
      relations: {
        restaurants: true,
      },
    });
    if (!gastronomicCulture) {
      throw new BusinessLogicException(
        "The gastronomic culture with the given id was not found",
        BusinessError.NOT_FOUND,
      );
    }

    const characteristicProduct = await this.restaurantRepository.findOne({
      where: { id: restaurantId },
    });
    if (!characteristicProduct) {
      throw new BusinessLogicException(
        "The characteristic product with the given id was not found",
        BusinessError.NOT_FOUND,
      );
    }

    gastronomicCulture.restaurants = [
      ...gastronomicCulture.restaurants,
      characteristicProduct,
    ];

    return this.gastronomicCultureRepository.save(gastronomicCulture);
  }

  async findRestaurantsFromGastronomicCulture(gastronomicCultureId: string) {
    const cacheKey = `${this.baseCacheKey}-restaurant-${gastronomicCultureId}`;
    const cachedRestaurants =
      await this.cacheManager.get<RestaurantEntity[]>(cacheKey);

    if (cachedRestaurants) {
      return cachedRestaurants;
    }

    const gastronomicCulture = await this.gastronomicCultureRepository.findOne({
      where: { id: gastronomicCultureId },
      relations: {
        restaurants: true,
      },
    });

    if (!gastronomicCulture) {
      throw new BusinessLogicException(
        "The gastronomic culture with the given id was not found",
        BusinessError.NOT_FOUND,
      );
    }

    await this.cacheManager.set(cacheKey, gastronomicCulture.restaurants);

    return gastronomicCulture.restaurants;
  }

  async findRestaurantFromGastronomicCulture(
    gastronomicCultureId: string,
    restaurantId: string,
  ) {
    const characteristicProduct = await this.restaurantRepository.findOne({
      where: { id: restaurantId },
    });

    if (!characteristicProduct)
      throw new BusinessLogicException(
        "The characteristic product with the given id was not found",
        BusinessError.NOT_FOUND,
      );

    const gastronomicCulture = await this.gastronomicCultureRepository.findOne({
      where: { id: gastronomicCultureId },
      relations: {
        restaurants: true,
      },
    });
    if (!gastronomicCulture)
      throw new BusinessLogicException(
        "The gastronomic culture with the given id was not found",
        BusinessError.NOT_FOUND,
      );

    const characteristicProductInGastronomicCulture =
      gastronomicCulture.restaurants.find((c) => c.id === restaurantId);
    if (!characteristicProductInGastronomicCulture)
      throw new BusinessLogicException(
        "The characteristic product does not belong to the given gastronomic culture",
        BusinessError.NOT_FOUND,
      );

    return characteristicProductInGastronomicCulture;
  }

  async associateRestaurantToGastronomicCulture(
    gastronomicCultureId: string,
    restaurantsDto: RestaurantDto[],
  ) {
    const gastronomicCulture = await this.gastronomicCultureRepository.findOne({
      where: { id: gastronomicCultureId },
      relations: {
        restaurants: true,
      },
    });

    if (!gastronomicCulture)
      throw new BusinessLogicException(
        "The gastronomic culture with the given id was not found",
        BusinessError.NOT_FOUND,
      );

    const restaurantsInstance = plainToInstance(
      RestaurantEntity,
      restaurantsDto,
    );

    await Promise.all(
      restaurantsInstance.map(async (characteristicProductInstance) => {
        const existingCharacteristicProduct =
          await this.restaurantRepository.findOne({
            where: { id: characteristicProductInstance.id },
          });

        if (!existingCharacteristicProduct)
          throw new BusinessLogicException(
            "The characteristic product with the given id was not found",
            BusinessError.NOT_FOUND,
          );

        return characteristicProductInstance;
      }),
    );

    gastronomicCulture.restaurants = restaurantsInstance;
    return await this.gastronomicCultureRepository.save(gastronomicCulture);
  }

  async deleteRestaurantFromGastronomicCulture(
    gastronomicCultureId: string,
    restaurantId: string,
  ) {
    const characteristicProduct = await this.restaurantRepository.findOne({
      where: { id: restaurantId },
    });
    if (!characteristicProduct)
      throw new BusinessLogicException(
        "The characteristic product with the given id was not found",
        BusinessError.NOT_FOUND,
      );

    const gastronomicCulture = await this.gastronomicCultureRepository.findOne({
      where: { id: gastronomicCultureId },
      relations: {
        restaurants: true,
      },
    });

    if (!gastronomicCulture)
      throw new BusinessLogicException(
        "The gastronomic culture with the given id was not found",
        BusinessError.NOT_FOUND,
      );

    const characteristicProductInGastronomicCulture =
      gastronomicCulture.restaurants.find(
        (c) => c.id === characteristicProduct.id,
      );

    if (!characteristicProductInGastronomicCulture) {
      throw new BusinessLogicException(
        "The characteristic product with the given id is not associated with the given gastronomic culture",
        BusinessError.PRECONDITION_FAILED,
      );
    }

    gastronomicCulture.restaurants = gastronomicCulture.restaurants.filter(
      (c) => c.id !== restaurantId,
    );

    await this.gastronomicCultureRepository.save(gastronomicCulture);
  }

  async addGastronomicCultureToRestaurant(
    restaurantId: string,
    gastronomicCultureId: string,
  ) {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id: restaurantId },
      relations: {
        gastronomicCultures: true,
      },
    });
    if (!restaurant) {
      throw new BusinessLogicException(
        "The restaurant with the given id was not found",
        BusinessError.NOT_FOUND,
      );
    }

    const gastronomicCulture = await this.gastronomicCultureRepository.findOne({
      where: { id: gastronomicCultureId },
    });
    if (!gastronomicCulture) {
      throw new BusinessLogicException(
        "The gastronomic culture with the given id was not found",
        BusinessError.NOT_FOUND,
      );
    }

    restaurant.gastronomicCultures = [
      ...restaurant.gastronomicCultures,
      gastronomicCulture,
    ];

    return this.restaurantRepository.save(restaurant);
  }
  async findGastronomicCulturesFromRestaurant(restaurantId: string) {
    const cacheKey = `${this.baseCacheKey}-restaurant-${restaurantId}`;
    const cachedGastronomicCultures =
      await this.cacheManager.get<GastronomicCultureEntity[]>(cacheKey);

    if (cachedGastronomicCultures) {
      return cachedGastronomicCultures;
    }

    const restaurant = await this.restaurantRepository.findOne({
      where: { id: restaurantId },
      relations: {
        gastronomicCultures: true,
      },
    });

    if (!restaurant) {
      throw new BusinessLogicException(
        "The restaurant with the given id was not found",
        BusinessError.NOT_FOUND,
      );
    }

    const gastronomicCultures = restaurant.gastronomicCultures;
    await this.cacheManager.set(cacheKey, gastronomicCultures);

    return gastronomicCultures;
  }

  async findGastronomicCultureFromRestaurant(
    restaurantId: string,
    gastronomicCultureId: string,
  ) {
    const gastronomicCulture = await this.gastronomicCultureRepository.findOne({
      where: { id: gastronomicCultureId },
    });

    if (!gastronomicCulture)
      throw new BusinessLogicException(
        "The gastronomic culture with the given id was not found",
        BusinessError.NOT_FOUND,
      );

    const restaurant = await this.restaurantRepository.findOne({
      where: { id: restaurantId },
      relations: {
        gastronomicCultures: true,
      },
    });
    if (!restaurant)
      throw new BusinessLogicException(
        "The restaurant with the given id was not found",
        BusinessError.NOT_FOUND,
      );

    const gastronomicCultureInRestaurant = restaurant.gastronomicCultures.find(
      (gc) => gc.id === gastronomicCultureId,
    );
    if (!gastronomicCultureInRestaurant)
      throw new BusinessLogicException(
        "The gastronomic culture does not belong to the given restaurant",
        BusinessError.NOT_FOUND,
      );

    return gastronomicCultureInRestaurant;
  }

  async associateGastronomicCulturesToRestaurant(
    restaurantId: string,
    gastronomicCulturesDto: GastronomicCultureDto[],
  ) {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id: restaurantId },
      relations: {
        gastronomicCultures: true,
      },
    });

    if (!restaurant)
      throw new BusinessLogicException(
        "The restaurant with the given id was not found",
        BusinessError.NOT_FOUND,
      );

    const gastronomicCulturesInstance = plainToInstance(
      GastronomicCultureEntity,
      gastronomicCulturesDto,
    );

    await Promise.all(
      gastronomicCulturesInstance.map(async (gastronomicCultureInstance) => {
        const existingGastronomicCulture =
          await this.gastronomicCultureRepository.findOne({
            where: { id: gastronomicCultureInstance.id },
          });

        if (!existingGastronomicCulture)
          throw new BusinessLogicException(
            "The gastronomic culture with the given id was not found",
            BusinessError.NOT_FOUND,
          );

        return gastronomicCultureInstance;
      }),
    );

    restaurant.gastronomicCultures = gastronomicCulturesInstance;
    return await this.restaurantRepository.save(restaurant);
  }

  async deleteGastronomicCultureFromRestaurant(
    restaurantId: string,
    gastronomicCultureId: string,
  ) {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id: restaurantId },
      relations: {
        gastronomicCultures: true,
      },
    });

    if (!restaurant)
      throw new BusinessLogicException(
        "The restaurant with the given id was not found",
        BusinessError.NOT_FOUND,
      );

    const gastronomicCulture = await this.gastronomicCultureRepository.findOne({
      where: { id: gastronomicCultureId },
    });

    if (!gastronomicCulture) {
      throw new BusinessLogicException(
        "The gastronomic culture with the given id was not found",
        BusinessError.NOT_FOUND,
      );
    }

    const gastronomicCultureInRestaurant = restaurant.gastronomicCultures.find(
      (gc) => gc.id === gastronomicCultureId,
    );

    if (!gastronomicCultureInRestaurant) {
      throw new BusinessLogicException(
        "The gastronomic culture with the given id is not associated with the given restaurant",
        BusinessError.PRECONDITION_FAILED,
      );
    }

    restaurant.gastronomicCultures = restaurant.gastronomicCultures.filter(
      (gc) => gc.id !== gastronomicCultureId,
    );

    await this.restaurantRepository.save(restaurant);
  }
}
