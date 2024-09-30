import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";

import { CharacteristicProductDto } from "@/characteristicProduct/characteristicProduct.dto";
import { GastronomicCultureCharacteristicProductService } from "./gastronomicCulture-characteristicProduct.service";
import { GastronomicCultureEntity } from "@/gastronomicCulture/gastronomicCulture.entity";

@Resolver()
export class GastronomicCultureCharacteristicProductResolver {
  constructor(
    private readonly gastronomicCultureCharacteristicProductService: GastronomicCultureCharacteristicProductService,
  ) {}

  @Query(() => GastronomicCultureEntity)
  async findCharacteristicProductFromGastronomicCulture(
    @Args("gastronomicCultureId") gastronomicCultureId: string,
    @Args("productId") productId: string,
  ) {
    return await this.gastronomicCultureCharacteristicProductService.findCharacteristicProductFromGastronomicCulture(
      gastronomicCultureId,
      productId,
    );
  }

  @Query(() => [GastronomicCultureEntity])
  async findCharacteristicProductsFromGastronomicCulture(
    @Args("gastronomicCultureId") gastronomicCultureId: string,
  ) {
    return await this.gastronomicCultureCharacteristicProductService.findCharacteristicProductsFromGastronomicCulture(
      gastronomicCultureId,
    );
  }

  @Mutation(() => GastronomicCultureEntity)
  async addCharacteristicProductToGastronomicCulture(
    @Args("gastronomicCultureId") gastronomicCultureId: string,
    @Args("productId") productId: string,
  ) {
    return await this.gastronomicCultureCharacteristicProductService.addCharacteristicProductToGastronomicCulture(
      gastronomicCultureId,
      productId,
    );
  }

  @Mutation(() => [GastronomicCultureEntity])
  async associateCharacteristicProductsToGastronomicCulture(
    @Args("gastronomicCultureId") gastronomicCultureId: string,
    @Args("characteristicProducts", { type: () => [CharacteristicProductDto] })
    characteristicProductsDto: CharacteristicProductDto[],
  ) {
    return await this.gastronomicCultureCharacteristicProductService.associateCharacteristicProductsToGastronomicCulture(
      gastronomicCultureId,
      characteristicProductsDto,
    );
  }

  @Mutation(() => Boolean)
  async deleteCharacteristicProductFromGastronomicCulture(
    @Args("gastronomicCultureId") gastronomicCultureId: string,
    @Args("productId") productId: string,
  ) {
    await this.gastronomicCultureCharacteristicProductService.deleteCharacteristicProductFromGastronomicCulture(
      gastronomicCultureId,
      productId,
    );
    return true;
  }
}
