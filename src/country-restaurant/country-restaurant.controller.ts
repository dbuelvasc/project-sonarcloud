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
import { BusinessErrorsInterceptor } from "@/shared/interceptors/business-errors/business-errors.interceptor";
import { CountryRestaurantService } from "./country-restaurant.service";

@Controller("country-restaurant")
@UseInterceptors(BusinessErrorsInterceptor)
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
