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
import { CountryDto } from "@/country/country.dto";
import {
  BusinessErrorsInterceptor,
  UUIDValidationInterceptor,
} from "@/shared/interceptors";
import { UserRoles } from "@/shared/security/userRoles";
import { GastronomicCultureCountryService } from "./gastronomicCulture-country.service";

@Controller("gastronomic-cultures")
@UseInterceptors(
  BusinessErrorsInterceptor,
  new UUIDValidationInterceptor("gastronomicCultureId"),
  new UUIDValidationInterceptor("countryId"),
)
@UseGuards(JwtAuthGuard, RoleGuard)
export class GastronomicCultureCountryController {
  constructor(
    private readonly gastronomicCultureCountryService: GastronomicCultureCountryService,
  ) {}

  @Get(":gastronomicCultureId/countries/:countryId")
  @Roles(UserRoles.ADMIN, UserRoles.FULL_READER)
  async findCharacteristicProductFromGastronomicCulture(
    @Param("gastronomicCultureId") gastronomicCultureId: string,
    @Param("countryId") countryId: string,
  ) {
    return await this.gastronomicCultureCountryService.findCountryFromGastronomicCulture(
      gastronomicCultureId,
      countryId,
    );
  }

  @Get(":gastronomicCultureId/countries")
  @Roles(UserRoles.ADMIN, UserRoles.FULL_READER, UserRoles.LIMITED_READER)
  async findRestaurantsByCountryId(
    @Param("gastronomicCultureId") gastronomicCultureId: string,
  ) {
    return await this.gastronomicCultureCountryService.findCountriesFromGastronomicCulture(
      gastronomicCultureId,
    );
  }

  @Post(":gastronomicCultureId/countries/:countryId")
  @Roles(UserRoles.ADMIN, UserRoles.WRITER)
  async addRestaurantToCountry(
    @Param("gastronomicCultureId") gastronomicCultureId: string,
    @Param("countryId") countryId: string,
  ) {
    return await this.gastronomicCultureCountryService.addCountryToGastronomicCulture(
      gastronomicCultureId,
      countryId,
    );
  }

  @Put(":gastronomicCultureId/countries")
  @Roles(UserRoles.ADMIN, UserRoles.WRITER)
  async associateRestaurantsToCountry(
    @Param("countryId") countryId: string,
    @Body() countriesDto: CountryDto[],
  ) {
    return await this.gastronomicCultureCountryService.associateCountryToGastronomicCulture(
      countryId,
      countriesDto,
    );
  }

  @Delete(":gastronomicCultureId/countries/:countryId")
  @Roles(UserRoles.ADMIN, UserRoles.DELETE)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteRestaurantFromCountry(
    @Param("gastronomicCultureId") gastronomicCultureId: string,
    @Param("countryId") countryId: string,
  ) {
    return await this.gastronomicCultureCountryService.deleteCountryFromGastronomicCulture(
      gastronomicCultureId,
      countryId,
    );
  }
}
