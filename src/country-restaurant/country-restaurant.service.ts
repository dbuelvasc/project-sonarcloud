import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Cache } from "cache-manager";
import { plainToInstance } from "class-transformer";
import { Repository } from "typeorm";

import { CountryEntity } from "@/country/country.entity";
import { RestaurantDto } from "@/restaurant/restaurant.dto";
import { RestaurantEntity } from "@/restaurant/restaurant.entity";
import {
  BusinessError,
  BusinessLogicException,
} from "@/shared/errors/business-errors";

@Injectable()
export class CountryRestaurantService {
  cacheKey = "country-restaurant";
  constructor(
    @InjectRepository(RestaurantEntity)
    private readonly restaurantRepository: Repository<RestaurantEntity>,

    @InjectRepository(CountryEntity)
    private readonly countryRepository: Repository<CountryEntity>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async addRestaurantToCountry(
    countryId: string,
    restaurantId: string,
  ): Promise<CountryEntity> {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id: restaurantId },
    });
    if (!restaurant)
      throw new BusinessLogicException(
        "The restaurant with the given id was not found",
        BusinessError.NOT_FOUND,
      );

    const country = await this.countryRepository.findOne({
      where: { id: countryId },
      relations: {
        restaurants: true,
      },
    });
    if (!country)
      throw new BusinessLogicException(
        "The country with the given id was not found",
        BusinessError.NOT_FOUND,
      );

    country.restaurants.push(restaurant);
    return await this.countryRepository.save(country);
  }

  async findRestaurantsFromCountry(
    countryId: string,
  ): Promise<RestaurantEntity[]> {
    const cachedRestaurants = await this.cacheManager.get<RestaurantEntity[]>(
      this.cacheKey,
    );

    if (cachedRestaurants) {
      return cachedRestaurants;
    }

    const country = await this.countryRepository.findOne({
      where: { id: countryId },
      relations: {
        restaurants: true,
      },
    });

    if (!country) {
      throw new BusinessLogicException(
        "The country with the given id was not found",
        BusinessError.NOT_FOUND,
      );
    }

    await this.cacheManager.set(this.cacheKey, country.restaurants);

    return country.restaurants;
  }

  async findRestaurantFromCountry(
    countryId: string,
    restaurantId: string,
  ): Promise<RestaurantEntity> {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id: restaurantId },
    });

    if (!restaurant)
      throw new BusinessLogicException(
        "The restaurant with the given id was not found",
        BusinessError.NOT_FOUND,
      );

    const country = await this.countryRepository.findOne({
      where: { id: countryId },
      relations: ["restaurants"],
    });
    if (!country)
      throw new BusinessLogicException(
        "The country with the given id was not found",
        BusinessError.NOT_FOUND,
      );

    const restaurantInCountry = country.restaurants.find(
      (r) => r.id === restaurantId,
    );
    if (!restaurantInCountry)
      throw new BusinessLogicException(
        "The restaurant does not belong to the given country",
        BusinessError.NOT_FOUND,
      );

    return restaurantInCountry;
  }

  async associateRestaurantsToCountry(
    countryId: string,
    restaurantsDto: RestaurantDto[],
  ) {
    const country = await this.countryRepository.findOne({
      where: { id: countryId },
      relations: {
        restaurants: true,
      },
    });

    if (!country)
      throw new BusinessLogicException(
        "The country with the given id was not found",
        BusinessError.NOT_FOUND,
      );

    const restaurantsInstance = plainToInstance(
      RestaurantEntity,
      restaurantsDto,
    );

    await Promise.all(
      restaurantsInstance.map(async (restaurantInstance) => {
        const existingRestaurant = await this.restaurantRepository.findOne({
          where: { id: restaurantInstance.id },
        });

        if (!existingRestaurant)
          throw new BusinessLogicException(
            "The restaurant with the given id was not found",
            BusinessError.NOT_FOUND,
          );

        return restaurantInstance;
      }),
    );

    country.restaurants = restaurantsInstance;
    return await this.countryRepository.save(country);
  }

  async deleteRestaurantFromCountry(countryId: string, restaurantId: string) {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id: restaurantId },
    });
    if (!restaurant)
      throw new BusinessLogicException(
        "The restaurant with the given id was not found",
        BusinessError.NOT_FOUND,
      );

    const country = await this.countryRepository.findOne({
      where: { id: countryId },
      relations: ["restaurants"],
    });

    if (!country)
      throw new BusinessLogicException(
        "The country with the given id was not found",
        BusinessError.NOT_FOUND,
      );

    const restaurantInCountry = country.restaurants.find(
      (r) => r.id === restaurant.id,
    );

    if (!restaurantInCountry) {
      throw new BusinessLogicException(
        "The restaurant with the given id is not associated with the given country",
        BusinessError.PRECONDITION_FAILED,
      );
    }

    country.restaurants = country.restaurants.filter(
      (r) => r.id !== restaurantId,
    );

    await this.countryRepository.save(country);
  }
}
