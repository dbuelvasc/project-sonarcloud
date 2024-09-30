import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";

import { GastronomicCultureCountryService } from "./gastronomicCulture-country.service";
import { GastronomicCultureDto } from "@/gastronomicCulture/gastronomicCulture.dto";
import { CountryEntity } from "@/country/country.entity";
import { GastronomicCultureEntity } from "@/gastronomicCulture/gastronomicCulture.entity";

@Resolver()
export class CountryGastronomicCultureResolver {
  constructor(
    private readonly gastronomicCultureCharacteristicProductService: GastronomicCultureCountryService,
  ) {}

  @Query(() => GastronomicCultureEntity)
  async findGastronomicCultureFromCountry(
    @Args("countryId") countryId: string,
    @Args("gastronomicCultureId") gastronomicCultureId: string,
  ) {
    return await this.gastronomicCultureCharacteristicProductService.findGastronomicCultureFromCountry(
      countryId,
      gastronomicCultureId,
    );
  }

  @Query(() => [GastronomicCultureEntity])
  async findGastronomicCulturesFromCountry(
    @Args("countryId") countryId: string,
  ) {
    return await this.gastronomicCultureCharacteristicProductService.findGastronomicCulturesFromCountry(
      countryId,
    );
  }

  @Mutation(() => CountryEntity)
  async addGastronomicCultureToCountry(
    @Args("countryId") countryId: string,
    @Args("gastronomicCultureId") gastronomicCultureId: string,
  ) {
    return await this.gastronomicCultureCharacteristicProductService.addGastronomicCultureToCountry(
      countryId,
      gastronomicCultureId,
    );
  }

  @Mutation(() => CountryEntity)
  async associateGastronomicCulturesToCountry(
    @Args("countryId") countryId: string,
    @Args("gastronomicCultures", { type: () => [GastronomicCultureDto] })
    gastronomicCulturesDto: GastronomicCultureDto[],
  ) {
    return await this.gastronomicCultureCharacteristicProductService.associateGastronomicCulturesToCountry(
      countryId,
      gastronomicCulturesDto,
    );
  }

  @Mutation(() => Boolean)
  async deleteGastronomicCultureFromCountry(
    @Args("countryId") countryId: string,
    @Args("gastronomicCultureId") gastronomicCultureId: string,
  ) {
    await this.gastronomicCultureCharacteristicProductService.deleteGastronomicCultureFromCountry(
      countryId,
      gastronomicCultureId,
    );
    return true;
  }
}
