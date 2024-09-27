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
import { RecipeDto } from "@/recipe/recipe.dto";
import {
  BusinessErrorsInterceptor,
  UUIDValidationInterceptor,
} from "@/shared/interceptors";
import { UserRoles } from "@/shared/security/userRoles";
import { GastronomicCultureRecipeService } from "./gastronomicCulture-recipe.service";

@Controller("gastronomic-cultures")
@UseInterceptors(
  BusinessErrorsInterceptor,
  new UUIDValidationInterceptor("gastronomicCultureId"),
  new UUIDValidationInterceptor("recipeId"),
)
@UseGuards(JwtAuthGuard, RoleGuard)
export class GastronomicCultureRecipeController {
  constructor(
    private readonly gastronomicCultureRecipeService: GastronomicCultureRecipeService,
  ) {}

  @Get(":gastronomicCultureId/recipes/:recipeId")
  @Roles(UserRoles.ADMIN, UserRoles.FULL_READER)
  async findCharacteristicProductFromGastronomicCulture(
    @Param("gastronomicCultureId") gastronomicCultureId: string,
    @Param("recipeId") recipeId: string,
  ) {
    return await this.gastronomicCultureRecipeService.findRecipeFromGastronomicCulture(
      gastronomicCultureId,
      recipeId,
    );
  }

  @Get(":gastronomicCultureId/recipes")
  @Roles(UserRoles.ADMIN, UserRoles.FULL_READER, UserRoles.LIMITED_READER)
  async findRestaurantsByRecipeId(
    @Param("gastronomicCultureId") gastronomicCultureId: string,
  ) {
    return await this.gastronomicCultureRecipeService.findRecipesFromGastronomicCulture(
      gastronomicCultureId,
    );
  }

  @Post(":gastronomicCultureId/recipes/:recipeId")
  @Roles(UserRoles.ADMIN, UserRoles.WRITER)
  async addRestaurantToRecipe(
    @Param("gastronomicCultureId") gastronomicCultureId: string,
    @Param("recipeId") recipeId: string,
  ) {
    return await this.gastronomicCultureRecipeService.addRecipeToGastronomicCulture(
      gastronomicCultureId,
      recipeId,
    );
  }

  @Put(":gastronomicCultureId/recipes")
  @Roles(UserRoles.ADMIN, UserRoles.WRITER)
  async associateRestaurantsToRecipe(
    @Param("recipeId") recipeId: string,
    @Body() recipesDto: RecipeDto[],
  ) {
    return await this.gastronomicCultureRecipeService.associateRecipeToGastronomicCulture(
      recipeId,
      recipesDto,
    );
  }

  @Delete(":gastronomicCultureId/recipes/:recipeId")
  @Roles(UserRoles.ADMIN, UserRoles.DELETE)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteRestaurantFromRecipe(
    @Param("gastronomicCultureId") gastronomicCultureId: string,
    @Param("recipeId") recipeId: string,
  ) {
    return await this.gastronomicCultureRecipeService.deleteRecipeFromGastronomicCulture(
      gastronomicCultureId,
      recipeId,
    );
  }
}
