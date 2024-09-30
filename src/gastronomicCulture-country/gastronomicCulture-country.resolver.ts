import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";

import { CountryDto } from "@/country/country.dto";
import { GastronomicCultureCountryService } from "./gastronomicCulture-country.service";
import { GastronomicCultureEntity } from "@/gastronomicCulture/gastronomicCulture.entity";
import { CountryEntity } from "@/country/country.entity";

@Resolver()
export class GastronomicCultureCountryResolver {
  constructor(
    private readonly gastronomicCultureCountryService: GastronomicCultureCountryService,
  ) {}

  @Query(() => CountryEntity)
  async findCountryFromGastronomicCulture(
    @Args("gastronomicCultureId") gastronomicCultureId: string,
    @Args("countryId") countryId: string,
  ) {
    return await this.gastronomicCultureCountryService.findCountryFromGastronomicCulture(
      gastronomicCultureId,
      countryId,
    );
  }

  @Query(() => [CountryEntity])
  async findCountriesFromGastronomicCulture(
    @Args("gastronomicCultureId") gastronomicCultureId: string,
  ) {
    return await this.gastronomicCultureCountryService.findCountriesFromGastronomicCulture(
      gastronomicCultureId,
    );
  }

  @Mutation(() => GastronomicCultureEntity)
  async addCountryToGastronomicCulture(
    @Args("gastronomicCultureId") gastronomicCultureId: string,
    @Args("countryId") countryId: string,
  ) {
    return await this.gastronomicCultureCountryService.addCountryToGastronomicCulture(
      gastronomicCultureId,
      countryId,
    );
  }

  @Mutation(() => GastronomicCultureEntity)
  async associateCountriesToGastronomicCulture(
    @Args("gastronomicCultureId") gastronomicCultureId: string,
    @Args("countries", { type: () => [CountryDto] })
    countriesDto: CountryDto[],
  ) {
    return await this.gastronomicCultureCountryService.associateCountriesToGastronomicCulture(
      gastronomicCultureId,
      countriesDto,
    );
  }

  @Mutation(() => Boolean)
  async deleteCountryFromGastronomicCulture(
    @Args("gastronomicCultureId") gastronomicCultureId: string,
    @Args("countryId") countryId: string,
  ) {
    await this.gastronomicCultureCountryService.deleteCountryFromGastronomicCulture(
      gastronomicCultureId,
      countryId,
    );
    return true;
  }
}
