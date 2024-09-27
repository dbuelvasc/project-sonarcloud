import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
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
import { GastronomicCultureRestaurantService } from "./gastronomicCulture-restaurant.service";

@Controller("gastronomic-cultures")
@UseInterceptors(
  BusinessErrorsInterceptor,
  new UUIDValidationInterceptor("gastronomicCultureId"),
  new UUIDValidationInterceptor("restaurantId"),
)
@UseGuards(JwtAuthGuard, RoleGuard)
export class GastronomicCultureRestaurantController {
  constructor(
    private readonly gastronomicCultureRestaurantService: GastronomicCultureRestaurantService,
  ) {}

  @Get(":gastronomicCultureId/countries/:restaurantId")
  @Roles(UserRoles.ADMIN, UserRoles.FULL_READER)
  async findCharacteristicProductFromGastronomicCulture(
    @Param("gastronomicCultureId") gastronomicCultureId: string,
    @Param("restaurantId") restaurantId: string,
  ) {
    return await this.gastronomicCultureRestaurantService.findRestaurantFromGastronomicCulture(
      gastronomicCultureId,
      restaurantId,
    );
  }

  @Get(":gastronomicCultureId/countries")
  @Roles(UserRoles.ADMIN, UserRoles.FULL_READER, UserRoles.LIMITED_READER)
  async findRestaurantsByRestaurantId(
    @Param("gastronomicCultureId") gastronomicCultureId: string,
  ) {
    return await this.gastronomicCultureRestaurantService.findRestaurantsFromGastronomicCulture(
      gastronomicCultureId,
    );
  }

  @Post(":gastronomicCultureId/countries/:restaurantId")
  @Roles(UserRoles.ADMIN, UserRoles.WRITER)
  async addRestaurantToRestaurant(
    @Param("gastronomicCultureId") gastronomicCultureId: string,
    @Param("restaurantId") restaurantId: string,
  ) {
    return await this.gastronomicCultureRestaurantService.addRestaurantToGastronomicCulture(
      gastronomicCultureId,
      restaurantId,
    );
  }

  @Put(":gastronomicCultureId/countries")
  @Roles(UserRoles.ADMIN, UserRoles.WRITER)
  async associateRestaurantsToGastronomicCulture(
    @Param("restaurantId") restaurantId: string,
    @Body() restaurantsDto: RestaurantDto[],
  ) {
    return await this.gastronomicCultureRestaurantService.associateRestaurantToGastronomicCulture(
      restaurantId,
      restaurantsDto,
    );
  }

  @Delete(":gastronomicCultureId/countries/:restaurantId")
  @Roles(UserRoles.ADMIN, UserRoles.DELETE)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteRestaurantFromRestaurant(
    @Param("gastronomicCultureId") gastronomicCultureId: string,
    @Param("restaurantId") restaurantId: string,
  ) {
    return await this.gastronomicCultureRestaurantService.deleteRestaurantFromGastronomicCulture(
      gastronomicCultureId,
      restaurantId,
    );
  }
}
