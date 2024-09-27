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
import {
  BusinessErrorsInterceptor,
  UUIDValidationInterceptor,
} from "@/shared/interceptors";
import { UserRoles } from "@/shared/security/userRoles";
import { GastronomicCultureRestaurantService } from "./gastronomicCulture-restaurant.service";
import { GastronomicCultureDto } from "@/gastronomicCulture/gastronomicCulture.dto";

@Controller("restaurants")
@UseInterceptors(
  BusinessErrorsInterceptor,
  new UUIDValidationInterceptor("restaurantId"),
  new UUIDValidationInterceptor("gastronomicCultureId"),
)
@UseGuards(JwtAuthGuard, RoleGuard)
export class RestaurantGastronomicCultureController {
  constructor(
    private readonly gastronomicCultureCharacteristicProductService: GastronomicCultureRestaurantService,
  ) {}

  @Get(":restaurantId/gastronomic-cultures/:gastronomicCultureId")
  @Roles(UserRoles.ADMIN, UserRoles.FULL_READER)
  async findCharacteristicProductFromGastronomicCulture(
    @Param("restaurantId") restaurantId: string,
    @Param("gastronomicCultureId") gastronomicCultureId: string,
  ) {
    return await this.gastronomicCultureCharacteristicProductService.findGastronomicCultureFromRestaurant(
      restaurantId,
      gastronomicCultureId,
    );
  }

  @Get(":restaurantId/gastronomic-cultures")
  @Roles(UserRoles.ADMIN, UserRoles.FULL_READER, UserRoles.LIMITED_READER)
  async findRestaurantsByRestaurantId(
    @Param("restaurantId") restaurantId: string,
  ) {
    return await this.gastronomicCultureCharacteristicProductService.findGastronomicCulturesFromRestaurant(
      restaurantId,
    );
  }

  @Post(":restaurantId/gastronomic-cultures/:gastronomicCultureId")
  @Roles(UserRoles.ADMIN, UserRoles.WRITER)
  async addRestaurantToRestaurant(
    @Param("restaurantId") restaurantId: string,
    @Param("gastronomicCultureId") gastronomicCultureId: string,
  ) {
    return await this.gastronomicCultureCharacteristicProductService.addGastronomicCultureToRestaurant(
      restaurantId,
      gastronomicCultureId,
    );
  }

  @Put(":restaurantId/gastronomic-cultures")
  @Roles(UserRoles.ADMIN, UserRoles.WRITER)
  async associateRestaurantsToRestaurant(
    @Param("restaurantId") restaurantId: string,
    @Body() gastronomicCulturesDto: GastronomicCultureDto[],
  ) {
    return await this.gastronomicCultureCharacteristicProductService.associateGastronomicCulturesToRestaurant(
      restaurantId,
      gastronomicCulturesDto,
    );
  }

  @Delete(":restaurantId/gastronomic-cultures/:gastronomicCultureId")
  @Roles(UserRoles.ADMIN, UserRoles.DELETE)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteRestaurantFromRestaurant(
    @Param("restaurantId") restaurantId: string,
    @Param("gastronomicCultureId") gastronomicCultureId: string,
  ) {
    return await this.gastronomicCultureCharacteristicProductService.deleteGastronomicCultureFromRestaurant(
      restaurantId,
      gastronomicCultureId,
    );
  }
}
