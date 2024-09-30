import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { RecipeDto } from "./recipe.dto";
import { RecipeEntity } from "./recipe.entity";
import { RecipeService } from "./recipe.service";

@Resolver()
export class RecipeResolver {
  constructor(private readonly recipeService: RecipeService) {}

  @Query(() => [RecipeEntity])
  async recipes() {
    return await this.recipeService.findAll(true);
  }

  @Query(() => RecipeEntity)
  async recipe(@Args("id") recipeId: string) {
    return await this.recipeService.findOne(recipeId, true);
  }

  @Mutation(() => RecipeEntity)
  async createRecipe(@Args("recipe") recipeDto: RecipeDto) {
    return await this.recipeService.create(recipeDto);
  }

  @Mutation(() => RecipeEntity)
  async updateRecipe(
    @Args("id") recipeId: string,
    @Args("recipe") recipeDto: RecipeDto,
  ) {
    return await this.recipeService.update(recipeId, recipeDto);
  }

  @Mutation(() => String)
  async deleteRecipe(@Args("id") recipeId: string) {
    await this.recipeService.delete(recipeId);
    return recipeId;
  }
}
