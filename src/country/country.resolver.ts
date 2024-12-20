import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";

import { CountryDto } from "./country.dto";
import { CountryEntity } from "./country.entity";
import { CountryService } from "./country.service";

@Resolver()
export class CountryResolver {
  constructor(private countryService: CountryService) {}

  @Query(() => [CountryEntity])
  countries(): Promise<CountryEntity[]> {
    return this.countryService.findAll(true);
  }
  @Query(() => CountryEntity)
  country(@Args("id") id: string): Promise<CountryEntity> {
    return this.countryService.findOne(id, true);
  }

  @Mutation(() => CountryEntity)
  createCountry(
    @Args("country") countryDto: CountryDto,
  ): Promise<CountryEntity> {
    return this.countryService.create(countryDto);
  }

  @Mutation(() => CountryEntity)
  updateCountry(
    @Args("id") id: string,
    @Args("country") countryDto: CountryDto,
  ): Promise<CountryEntity> {
    return this.countryService.update(id, countryDto);
  }

  @Mutation(() => String)
  deleteCountry(@Args("id") id: string) {
    this.countryService.delete(id);
    return id;
  }
}
