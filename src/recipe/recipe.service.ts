import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Cache } from "cache-manager";
import { plainToInstance } from "class-transformer";
import { Repository } from "typeorm";

import {
  BusinessError,
  BusinessLogicException,
} from "@/shared/errors/business-errors";
import { RecipeDto } from "./recipe.dto";
import { RecipeEntity } from "./recipe.entity";

@Injectable()
export class RecipeService {
  cacheKey = "recipes";
  constructor(
    @InjectRepository(RecipeEntity)
    private readonly recipeRepository: Repository<RecipeEntity>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async findAll(): Promise<RecipeEntity[]> {
    const cachedRecipes = await this.cacheManager.get<
      RecipeEntity[] | undefined
    >(this.cacheKey);

    if (cachedRecipes) {
      return cachedRecipes;
    }

    const recipes = await this.recipeRepository.find();

    await this.cacheManager.set(this.cacheKey, recipes);

    return recipes;
  }

  async findOne(id: string): Promise<RecipeEntity> {
    const recipe = await this.recipeRepository.findOne({ where: { id } });
    if (!recipe) {
      throw new BusinessLogicException(
        "The recipe with the given id was not found",
        BusinessError.NOT_FOUND,
      );
    }
    return recipe;
  }

  async create(recipeDto: RecipeDto): Promise<RecipeEntity> {
    const recipeInstance = plainToInstance(RecipeEntity, recipeDto);

    const recipe = this.recipeRepository.create(recipeInstance);

    return this.recipeRepository.save(recipe);
  }

  async update(id: string, recipeDto: RecipeDto): Promise<RecipeEntity> {
    const persistedRecipe = await this.recipeRepository.findOne({
      where: { id },
    });
    if (!persistedRecipe) {
      throw new BusinessLogicException(
        "The recipe with the given id was not found",
        BusinessError.NOT_FOUND,
      );
    }

    const recipeInstance = plainToInstance(RecipeEntity, recipeDto);

    return this.recipeRepository.save({
      ...persistedRecipe,
      ...recipeInstance,
    });
  }

  async delete(id: string) {
    const recipe = await this.recipeRepository.findOne({ where: { id } });
    if (!recipe) {
      throw new BusinessLogicException(
        "The recipe with the given id was not found",
        BusinessError.NOT_FOUND,
      );
    }
    await this.recipeRepository.remove(recipe);
  }
}
