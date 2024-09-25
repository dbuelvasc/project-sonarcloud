import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";

import { JwtAuthGuard } from "@/auth/guards";
import { RoleGuard } from "@/auth/roles/role.guard";
import { Roles } from "@/auth/roles/roles.decorator";
import { UserRoles } from "@/shared/security/userRoles";
import {
  BusinessErrorsInterceptor,
  UUIDValidationInterceptor,
} from "@/shared/interceptors";
import { GastronomicCultureCharacteristicProductService } from "./gastronomicCulture-characteristicProduct.service";

@Controller("gastronomic-cultures")
@UseInterceptors(
  BusinessErrorsInterceptor,
  new UUIDValidationInterceptor("gastronomicCultureId"),
  new UUIDValidationInterceptor("characteristicProductId"),
)
@UseGuards(JwtAuthGuard, RoleGuard)
export class GastronomicCultureCharacteristicProductController {
  constructor(
    private readonly gastronomicCultureCharacteristicProductService: GastronomicCultureCharacteristicProductService,
  ) {}

  @Get(":gastronomicCultureId/products/:productId")
  @Roles(UserRoles.ADMIN, UserRoles.FULL_READER)
  async findCharacteristicProductFromGastronomicCulture(
    @Param("gastronomicCultureId") gastronomicCultureId: string,
    @Param("productId") productId: string,
  ) {
    return await this.gastronomicCultureCharacteristicProductService.findCharacteristicProductFromGastronomicCulture(
      gastronomicCultureId,
      productId,
    );
  }

  @Get(":gastronomicCultureId/products")
  @Roles(UserRoles.ADMIN, UserRoles.FULL_READER)
  async findRestaurantsByCountryId(
    @Param("gastronomicCultureId") gastronomicCultureId: string,
  ) {
    return await this.gastronomicCultureCharacteristicProductService.findCharacteristicProductsFromGastronomicCulture(
      gastronomicCultureId,
    );
  }

  @Post(":gastronomicCultureId/products/:productId")
  @Roles(UserRoles.ADMIN, UserRoles.WRITER)
  async addRestaurantToCountry(
    @Param("gastronomicCultureId") gastronomicCultureId: string,
    @Param("productId") productId: string,
  ) {
    return await this.gastronomicCultureCharacteristicProductService.addCharacteristicProductToGastronomicCulture(
      gastronomicCultureId,
      productId,
    );
  }

  @Delete(":gastronomicCultureId/products/:productId")
  @Roles(UserRoles.ADMIN, UserRoles.DELETE)
  @HttpCode(204)
  async deleteRestaurantFromCountry(
    @Param("gastronomicCultureId") gastronomicCultureId: string,
    @Param("productId") productId: string,
  ) {
    return await this.gastronomicCultureCharacteristicProductService.deleteCharacteristicProductFromGastronomicCulture(
      gastronomicCultureId,
      productId,
    );
  }
}
