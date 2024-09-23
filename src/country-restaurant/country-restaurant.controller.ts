import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  UseInterceptors,
} from "@nestjs/common";

import { RestaurantEntity } from "@/restaurant/restaurant.entity";
import {
  BusinessErrorsInterceptor,
  UUIDValidationInterceptor,
} from "@/shared/interceptors";
import { CountryRestaurantService } from "./country-restaurant.service";

@Controller("countries")
@UseInterceptors(
  BusinessErrorsInterceptor,
  new UUIDValidationInterceptor("countryId"),
  new UUIDValidationInterceptor("restaurantId"),
)
export class CountryRestaurantController {
  constructor(
    private readonly countryRestaurantService: CountryRestaurantService,
  ) {}

  @Get(":countryId/restaurants/:restaurantId")
  async findRestaurantByCountryIdRestaurantId(
    @Param("countryId") countryId: string,
    @Param("restaurantId") restaurantId: string,
  ): Promise<RestaurantEntity> {
    return await this.countryRestaurantService.findRestaurantFromCountry(
      countryId,
      restaurantId,
    );
  }

  @Get(":countryId/restaurants")
  async findRestaurantsByCountryId(
    @Param("countryId") countryId: string,
  ): Promise<RestaurantEntity[]> {
    return await this.countryRestaurantService.findRestaurantsFromCountry(
      countryId,
    );
  }

  @Post(":countryId/restaurants/:restaurantId")
  async addRestaurantToCountry(
    @Param("countryId") countryId: string,
    @Param("restaurantId") restaurantId: string,
  ): Promise<RestaurantEntity> {
    return await this.countryRestaurantService.addRestaurantToCountry(
      countryId,
      restaurantId,
    );
  }

  @Delete(":countryId/restaurants/:restaurantId")
  @HttpCode(204)
  async deleteRestaurantFromCountry(
    @Param("countryId") countryId: string,
    @Param("restaurantId") restaurantId: string,
  ): Promise<void> {
    await this.countryRestaurantService.deleteRestaurantFromCountry(
      countryId,
      restaurantId,
    );
  }
}
