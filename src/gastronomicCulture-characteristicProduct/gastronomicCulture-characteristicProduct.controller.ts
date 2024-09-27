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
import { CharacteristicProductDto } from "@/characteristicProduct/characteristicProduct.dto";
import {
  BusinessErrorsInterceptor,
  UUIDValidationInterceptor,
} from "@/shared/interceptors";
import { UserRoles } from "@/shared/security/userRoles";
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
  @Roles(UserRoles.ADMIN, UserRoles.FULL_READER, UserRoles.LIMITED_READER)
  async findCharacteristicProductsFromGastronomicCulture(
    @Param("gastronomicCultureId") gastronomicCultureId: string,
  ) {
    return await this.gastronomicCultureCharacteristicProductService.findCharacteristicProductsFromGastronomicCulture(
      gastronomicCultureId,
    );
  }

  @Post(":gastronomicCultureId/products/:productId")
  @Roles(UserRoles.ADMIN, UserRoles.WRITER)
  async addCharacteristicProductToGastronomicCulture(
    @Param("gastronomicCultureId") gastronomicCultureId: string,
    @Param("productId") productId: string,
  ) {
    return await this.gastronomicCultureCharacteristicProductService.addCharacteristicProductToGastronomicCulture(
      gastronomicCultureId,
      productId,
    );
  }

  @Put(":gastronomicCultureId/products")
  @Roles(UserRoles.ADMIN, UserRoles.WRITER)
  async associateCharacteristicProductsToGastronomicCulture(
    @Param("gastronomicCultureId") gastronomicCultureId: string,
    @Body() characteristicProductsDto: CharacteristicProductDto[],
  ) {
    return await this.gastronomicCultureCharacteristicProductService.associateCharacteristicProductsToGastronomicCulture(
      gastronomicCultureId,
      characteristicProductsDto,
    );
  }

  @Delete(":gastronomicCultureId/products/:productId")
  @Roles(UserRoles.ADMIN, UserRoles.DELETE)
  @HttpCode(HttpStatus.NO_CONTENT)
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
