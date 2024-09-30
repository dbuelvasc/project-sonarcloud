import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { CountryRestaurantService } from "./country-restaurant.service";
import { RestaurantDto } from "@/restaurant/restaurant.dto";
import { CountryEntity } from "@/country/country.entity";
import { RestaurantEntity } from "@/restaurant/restaurant.entity";

@Resolver()
export class CountryRestaurantResolver {
  constructor(
    private readonly countryRestaurantService: CountryRestaurantService,
  ) {}

  @Query(() => RestaurantEntity)
  async findRestaurantFromCountry(
    @Args("countryId") countryId: string,
    @Args("restaurantId") restaurantId: string,
  ) {
    return await this.countryRestaurantService.findRestaurantFromCountry(
      countryId,
      restaurantId,
    );
  }

  @Query(() => [RestaurantEntity])
  async findRestaurantsFromCountry(@Args("countryId") countryId: string) {
    return await this.countryRestaurantService.findRestaurantsFromCountry(
      countryId,
    );
  }

  @Mutation(() => CountryEntity)
  async addRestaurantToCountry(
    @Args("countryId") countryId: string,
    @Args("restaurantId") restaurantId: string,
  ) {
    return await this.countryRestaurantService.addRestaurantToCountry(
      countryId,
      restaurantId,
    );
  }

  @Mutation(() => CountryEntity)
  async associateRestaurantsToCountry(
    @Args("countryId") countryId: string,
    @Args("restaurants", { type: () => [RestaurantDto] })
    restaurantsDto: RestaurantDto[],
  ) {
    return await this.countryRestaurantService.associateRestaurantsToCountry(
      countryId,
      restaurantsDto,
    );
  }

  @Mutation(() => Boolean)
  async deleteRestaurantFromCountry(
    @Args("countryId") countryId: string,
    @Args("restaurantId") restaurantId: string,
  ) {
    await this.countryRestaurantService.deleteRestaurantFromCountry(
      countryId,
      restaurantId,
    );
    return true;
  }
}
