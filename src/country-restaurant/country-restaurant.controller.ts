import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";

import { JwtAuthGuard } from "@/auth/guards";
import { RoleGuard } from "@/auth/roles/role.guard";
import { Roles } from "@/auth/roles/roles.decorator";
import { RestaurantDto } from "@/restaurant/restaurant.dto";
import {
  BusinessErrorsInterceptor,
  UUIDValidationInterceptor,
} from "@/shared/interceptors";
import { UserRoles } from "@/shared/security/userRoles";
import { CountryRestaurantService } from "./country-restaurant.service";

@Controller("countries")
@UseInterceptors(
  BusinessErrorsInterceptor,
  new UUIDValidationInterceptor("countryId"),
  new UUIDValidationInterceptor("restaurantId"),
)
@UseGuards(JwtAuthGuard, RoleGuard)
export class CountryRestaurantController {
  constructor(
    private readonly countryRestaurantService: CountryRestaurantService,
  ) {}

  @Get(":countryId/restaurants/:restaurantId")
  @Roles(UserRoles.ADMIN, UserRoles.FULL_READER)
  async findRestaurantByCountryIdRestaurantId(
    @Param("countryId") countryId: string,
    @Param("restaurantId") restaurantId: string,
  ) {
    return await this.countryRestaurantService.findRestaurantFromCountry(
      countryId,
      restaurantId,
    );
  }

  @Get(":countryId/restaurants")
  @Roles(UserRoles.ADMIN, UserRoles.FULL_READER)
  async findRestaurantsByCountryId(@Param("countryId") countryId: string) {
    return await this.countryRestaurantService.findRestaurantsFromCountry(
      countryId,
    );
  }

  @Post(":countryId/restaurants/:restaurantId")
  @Roles(UserRoles.ADMIN, UserRoles.WRITER)
  async addRestaurantToCountry(
    @Param("countryId") countryId: string,
    @Param("restaurantId") restaurantId: string,
  ) {
    return await this.countryRestaurantService.addRestaurantToCountry(
      countryId,
      restaurantId,
    );
  }

  @Put(":countryId/restaurants")
  @Roles(UserRoles.ADMIN, UserRoles.WRITER)
  async associateRestaurantsToCountry(
    @Param("countryId") countryId: string,
    @Body() restaurantsDto: RestaurantDto[],
  ) {
    return await this.countryRestaurantService.associateRestaurantsToCountry(
      countryId,
      restaurantsDto,
    );
  }

  @Delete(":countryId/restaurants/:restaurantId")
  @Roles(UserRoles.ADMIN, UserRoles.DELETE)
  @HttpCode(204)
  async deleteRestaurantFromCountry(
    @Param("countryId") countryId: string,
    @Param("restaurantId") restaurantId: string,
  ) {
    return await this.countryRestaurantService.deleteRestaurantFromCountry(
      countryId,
      restaurantId,
    );
  }
}
