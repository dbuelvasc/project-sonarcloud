import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Cache } from "cache-manager";
import { plainToInstance } from "class-transformer";
import { Repository } from "typeorm";

import { RecipeDto } from "@/recipe/recipe.dto";
import { RecipeEntity } from "@/recipe/recipe.entity";
import { GastronomicCultureEntity } from "@/gastronomicCulture/gastronomicCulture.entity";
import {
  BusinessError,
  BusinessLogicException,
} from "@/shared/errors/business-errors";

@Injectable()
export class GastronomicCultureRecipeService {
  baseCacheKey = "gastronomicCulture-recipe";

  constructor(
    @InjectRepository(GastronomicCultureEntity)
    private readonly gastronomicCultureRepository: Repository<GastronomicCultureEntity>,
    @InjectRepository(RecipeEntity)
    private readonly recipeRepository: Repository<RecipeEntity>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async addRecipeToGastronomicCulture(
    gastronomicCultureId: string,
    recipeId: string,
  ) {
    const gastronomicCulture = await this.gastronomicCultureRepository.findOne({
      where: { id: gastronomicCultureId },
      relations: {
        recipes: true,
      },
    });
    if (!gastronomicCulture) {
      throw new BusinessLogicException(
        "The gastronomic culture with the given id was not found",
        BusinessError.NOT_FOUND,
      );
    }

    const characteristicProduct = await this.recipeRepository.findOne({
      where: { id: recipeId },
    });
    if (!characteristicProduct) {
      throw new BusinessLogicException(
        "The characteristic product with the given id was not found",
        BusinessError.NOT_FOUND,
      );
    }

    gastronomicCulture.recipes = [
      ...gastronomicCulture.recipes,
      characteristicProduct,
    ];

    return this.gastronomicCultureRepository.save(gastronomicCulture);
  }

  async findRecipesFromGastronomicCulture(gastronomicCultureId: string) {
    const cacheKey = `${this.baseCacheKey}-${gastronomicCultureId}`;
    const cachedRecipes = await this.cacheManager.get<RecipeEntity[]>(cacheKey);

    if (cachedRecipes) {
      return cachedRecipes;
    }

    const gastronomicCulture = await this.gastronomicCultureRepository.findOne({
      where: { id: gastronomicCultureId },
      relations: {
        recipes: true,
      },
    });

    if (!gastronomicCulture) {
      throw new BusinessLogicException(
        "The gastronomic culture with the given id was not found",
        BusinessError.NOT_FOUND,
      );
    }

    await this.cacheManager.set(cacheKey, gastronomicCulture.recipes);

    return gastronomicCulture.recipes;
  }

  async findRecipeFromGastronomicCulture(
    gastronomicCultureId: string,
    recipeId: string,
  ) {
    const characteristicProduct = await this.recipeRepository.findOne({
      where: { id: recipeId },
    });

    if (!characteristicProduct)
      throw new BusinessLogicException(
        "The characteristic product with the given id was not found",
        BusinessError.NOT_FOUND,
      );

    const gastronomicCulture = await this.gastronomicCultureRepository.findOne({
      where: { id: gastronomicCultureId },
      relations: {
        recipes: true,
      },
    });
    if (!gastronomicCulture)
      throw new BusinessLogicException(
        "The gastronomic culture with the given id was not found",
        BusinessError.NOT_FOUND,
      );

    const characteristicProductInGastronomicCulture =
      gastronomicCulture.recipes.find((c) => c.id === recipeId);
    if (!characteristicProductInGastronomicCulture)
      throw new BusinessLogicException(
        "The characteristic product does not belong to the given gastronomic culture",
        BusinessError.NOT_FOUND,
      );

    return characteristicProductInGastronomicCulture;
  }

  async associateRecipeToGastronomicCulture(
    gastronomicCultureId: string,
    recipesDto: RecipeDto[],
  ) {
    const gastronomicCulture = await this.gastronomicCultureRepository.findOne({
      where: { id: gastronomicCultureId },
      relations: {
        recipes: true,
      },
    });

    if (!gastronomicCulture)
      throw new BusinessLogicException(
        "The gastronomic culture with the given id was not found",
        BusinessError.NOT_FOUND,
      );

    const recipesInstance = plainToInstance(RecipeEntity, recipesDto);

    await Promise.all(
      recipesInstance.map(async (characteristicProductInstance) => {
        const existingCharacteristicProduct =
          await this.recipeRepository.findOne({
            where: { id: characteristicProductInstance.id },
          });

        if (!existingCharacteristicProduct)
          throw new BusinessLogicException(
            "The characteristic product with the given id was not found",
            BusinessError.NOT_FOUND,
          );

        return characteristicProductInstance;
      }),
    );

    gastronomicCulture.recipes = recipesInstance;
    return await this.gastronomicCultureRepository.save(gastronomicCulture);
  }

  async deleteRecipeFromGastronomicCulture(
    gastronomicCultureId: string,
    recipeId: string,
  ) {
    const characteristicProduct = await this.recipeRepository.findOne({
      where: { id: recipeId },
    });
    if (!characteristicProduct)
      throw new BusinessLogicException(
        "The characteristic product with the given id was not found",
        BusinessError.NOT_FOUND,
      );

    const gastronomicCulture = await this.gastronomicCultureRepository.findOne({
      where: { id: gastronomicCultureId },
      relations: {
        recipes: true,
      },
    });

    if (!gastronomicCulture)
      throw new BusinessLogicException(
        "The gastronomic culture with the given id was not found",
        BusinessError.NOT_FOUND,
      );

    const characteristicProductInGastronomicCulture =
      gastronomicCulture.recipes.find((c) => c.id === characteristicProduct.id);

    if (!characteristicProductInGastronomicCulture) {
      throw new BusinessLogicException(
        "The characteristic product with the given id is not associated with the given gastronomic culture",
        BusinessError.PRECONDITION_FAILED,
      );
    }

    gastronomicCulture.recipes = gastronomicCulture.recipes.filter(
      (c) => c.id !== recipeId,
    );

    await this.gastronomicCultureRepository.save(gastronomicCulture);
  }
}
