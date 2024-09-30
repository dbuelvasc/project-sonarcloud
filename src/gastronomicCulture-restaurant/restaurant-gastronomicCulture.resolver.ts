import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { GastronomicCultureRestaurantService } from "./gastronomicCulture-restaurant.service";
import { GastronomicCultureDto } from "@/gastronomicCulture/gastronomicCulture.dto";
import { RestaurantEntity } from "@/restaurant/restaurant.entity";
import { GastronomicCultureEntity } from "@/gastronomicCulture/gastronomicCulture.entity";

@Resolver()
export class RestaurantGastronomicCultureResolver {
  constructor(
    private readonly gastronomicCultureCharacteristicProductService: GastronomicCultureRestaurantService,
  ) {}

  @Query(() => GastronomicCultureEntity)
  async findGastronomicCultureFromRestaurant(
    @Args("restaurantId") restaurantId: string,
    @Args("gastronomicCultureId") gastronomicCultureId: string,
  ) {
    return await this.gastronomicCultureCharacteristicProductService.findGastronomicCultureFromRestaurant(
      restaurantId,
      gastronomicCultureId,
    );
  }

  @Query(() => [GastronomicCultureEntity])
  async findGastronomicCulturesByRestaurant(
    @Args("restaurantId") restaurantId: string,
  ) {
    return await this.gastronomicCultureCharacteristicProductService.findGastronomicCulturesFromRestaurant(
      restaurantId,
    );
  }

  @Mutation(() => RestaurantEntity)
  async addGastronomicCultureToRestaurant(
    @Args("restaurantId") restaurantId: string,
    @Args("gastronomicCultureId") gastronomicCultureId: string,
  ) {
    return await this.gastronomicCultureCharacteristicProductService.addGastronomicCultureToRestaurant(
      restaurantId,
      gastronomicCultureId,
    );
  }

  @Mutation(() => RestaurantEntity)
  async associateGastronomicCulturesToRestaurant(
    @Args("restaurantId") restaurantId: string,
    @Args("gastronomicCultures", { type: () => [GastronomicCultureDto] })
    gastronomicCulturesDto: GastronomicCultureDto[],
  ) {
    return await this.gastronomicCultureCharacteristicProductService.associateGastronomicCulturesToRestaurant(
      restaurantId,
      gastronomicCulturesDto,
    );
  }

  @Mutation(() => Boolean)
  async deleteGastronomicCultureFromRestaurant(
    @Args("restaurantId") restaurantId: string,
    @Args("gastronomicCultureId") gastronomicCultureId: string,
  ) {
    await this.gastronomicCultureCharacteristicProductService.deleteGastronomicCultureFromRestaurant(
      restaurantId,
      gastronomicCultureId,
    );
    return true;
  }
}
