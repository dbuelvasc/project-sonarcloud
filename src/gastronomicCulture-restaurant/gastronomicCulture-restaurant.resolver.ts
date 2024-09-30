import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { GastronomicCultureRestaurantService } from "./gastronomicCulture-restaurant.service";
import { RestaurantDto } from "@/restaurant/restaurant.dto";
import { GastronomicCultureEntity } from "@/gastronomicCulture/gastronomicCulture.entity";
import { RestaurantEntity } from "@/restaurant/restaurant.entity";

@Resolver()
export class GastronomicCultureRestaurantResolver {
  constructor(
    private readonly gastronomicCultureRestaurantService: GastronomicCultureRestaurantService,
  ) {}

  @Query(() => RestaurantEntity)
  async findRestaurantFromGastronomicCulture(
    @Args("gastronomicCultureId") gastronomicCultureId: string,
    @Args("restaurantId") restaurantId: string,
  ) {
    return await this.gastronomicCultureRestaurantService.findRestaurantFromGastronomicCulture(
      gastronomicCultureId,
      restaurantId,
    );
  }

  @Query(() => [RestaurantEntity])
  async findRestaurantsByGastronomicCulture(
    @Args("gastronomicCultureId") gastronomicCultureId: string,
  ) {
    return await this.gastronomicCultureRestaurantService.findRestaurantsFromGastronomicCulture(
      gastronomicCultureId,
    );
  }

  @Mutation(() => GastronomicCultureEntity)
  async addRestaurantToGastronomicCulture(
    @Args("gastronomicCultureId") gastronomicCultureId: string,
    @Args("restaurantId") restaurantId: string,
  ) {
    return await this.gastronomicCultureRestaurantService.addRestaurantToGastronomicCulture(
      gastronomicCultureId,
      restaurantId,
    );
  }

  @Mutation(() => GastronomicCultureEntity)
  async associateRestaurantsToGastronomicCulture(
    @Args("restaurantId") restaurantId: string,
    @Args("restaurants", { type: () => [RestaurantDto] })
    restaurantsDto: RestaurantDto[],
  ) {
    return await this.gastronomicCultureRestaurantService.associateRestaurantToGastronomicCulture(
      restaurantId,
      restaurantsDto,
    );
  }

  @Mutation(() => Boolean)
  async deleteRestaurantFromGastronomicCulture(
    @Args("gastronomicCultureId") gastronomicCultureId: string,
    @Args("restaurantId") restaurantId: string,
  ) {
    await this.gastronomicCultureRestaurantService.deleteRestaurantFromGastronomicCulture(
      gastronomicCultureId,
      restaurantId,
    );
    return true;
  }
}
