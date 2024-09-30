import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";

import { GastronomicCultureEntity } from "@/gastronomicCulture/gastronomicCulture.entity";
import { RecipeDto } from "@/recipe/recipe.dto";
import { RecipeEntity } from "@/recipe/recipe.entity";
import { GastronomicCultureRecipeService } from "./gastronomicCulture-recipe.service";

@Resolver()
export class GastronomicCultureRecipeResolver {
  constructor(
    private readonly gastronomicCultureRecipeService: GastronomicCultureRecipeService,
  ) {}

  @Query(() => RecipeEntity)
  async findCharacteristicProductFromRecipe(
    @Args("gastronomicCultureId") gastronomicCultureId: string,
    @Args("recipeId") recipeId: string,
  ) {
    return await this.gastronomicCultureRecipeService.findRecipeFromGastronomicCulture(
      gastronomicCultureId,
      recipeId,
    );
  }

  @Query(() => [RecipeEntity])
  async findRestaurantsByRecipeId(
    @Args("gastronomicCultureId") gastronomicCultureId: string,
  ) {
    return await this.gastronomicCultureRecipeService.findRecipesFromGastronomicCulture(
      gastronomicCultureId,
    );
  }

  @Mutation(() => GastronomicCultureEntity)
  async addRestaurantToRecipe(
    @Args("gastronomicCultureId") gastronomicCultureId: string,
    @Args("recipeId") recipeId: string,
  ) {
    return await this.gastronomicCultureRecipeService.addRecipeToGastronomicCulture(
      gastronomicCultureId,
      recipeId,
    );
  }

  @Mutation(() => GastronomicCultureEntity)
  async associateRestaurantsToRecipe(
    @Args("recipeId") recipeId: string,
    @Args("recipes", { type: () => [RecipeDto] }) recipesDto: RecipeDto[],
  ) {
    return await this.gastronomicCultureRecipeService.associateRecipeToGastronomicCulture(
      recipeId,
      recipesDto,
    );
  }

  @Mutation(() => Boolean)
  async deleteRestaurantFromRecipe(
    @Args("gastronomicCultureId") gastronomicCultureId: string,
    @Args("recipeId") recipeId: string,
  ) {
    await this.gastronomicCultureRecipeService.deleteRecipeFromGastronomicCulture(
      gastronomicCultureId,
      recipeId,
    );
    return true;
  }
}
