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
import { GastronomicCultureCountryService } from "./gastronomicCulture-country.service";
import { GastronomicCultureDto } from "@/gastronomicCulture/gastronomicCulture.dto";

@Controller("countries")
@UseInterceptors(
  BusinessErrorsInterceptor,
  new UUIDValidationInterceptor("countryId"),
  new UUIDValidationInterceptor("gastronomicCultureId"),
)
@UseGuards(JwtAuthGuard, RoleGuard)
export class CountryGastronomicCultureController {
  constructor(
    private readonly gastronomicCultureCharacteristicProductService: GastronomicCultureCountryService,
  ) {}

  @Get(":countryId/gastronomic-cultures/:gastronomicCultureId")
  @Roles(UserRoles.ADMIN, UserRoles.FULL_READER)
  async findGastronomicCultureFromCountry(
    @Param("countryId") countryId: string,
    @Param("gastronomicCultureId") gastronomicCultureId: string,
  ) {
    return await this.gastronomicCultureCharacteristicProductService.findGastronomicCultureFromCountry(
      countryId,
      gastronomicCultureId,
    );
  }

  @Get(":countryId/gastronomic-cultures")
  @Roles(UserRoles.ADMIN, UserRoles.FULL_READER, UserRoles.LIMITED_READER)
  async findGastronomicCulturesFromCountry(
    @Param("countryId") countryId: string,
  ) {
    return await this.gastronomicCultureCharacteristicProductService.findGastronomicCulturesFromCountry(
      countryId,
    );
  }

  @Post(":countryId/gastronomic-cultures/:gastronomicCultureId")
  @Roles(UserRoles.ADMIN, UserRoles.WRITER)
  async addGastronomicCultureToCountry(
    @Param("countryId") countryId: string,
    @Param("gastronomicCultureId") gastronomicCultureId: string,
  ) {
    return await this.gastronomicCultureCharacteristicProductService.addGastronomicCultureToCountry(
      countryId,
      gastronomicCultureId,
    );
  }

  @Put(":countryId/gastronomic-cultures")
  @Roles(UserRoles.ADMIN, UserRoles.WRITER)
  async associateGastronomicCulturesToCountry(
    @Param("countryId") countryId: string,
    @Body() gastronomicCulturesDto: GastronomicCultureDto[],
  ) {
    return await this.gastronomicCultureCharacteristicProductService.associateGastronomicCulturesToCountry(
      countryId,
      gastronomicCulturesDto,
    );
  }

  @Delete(":countryId/gastronomic-cultures/:gastronomicCultureId")
  @Roles(UserRoles.ADMIN, UserRoles.DELETE)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteGastronomicCultureFromCountry(
    @Param("countryId") countryId: string,
    @Param("gastronomicCultureId") gastronomicCultureId: string,
  ) {
    return await this.gastronomicCultureCharacteristicProductService.deleteGastronomicCultureFromCountry(
      countryId,
      gastronomicCultureId,
    );
  }
}
