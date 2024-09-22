import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import {
  BusinessError,
  BusinessLogicException,
} from "@/shared/errors/business-errors";
import { RecipeEntity } from "./recipe.entity";

@Injectable()
export class RecipeService {
  constructor(
    @InjectRepository(RecipeEntity)
    private readonly recipeRepository: Repository<RecipeEntity>,
  ) {}

  async findAll(): Promise<RecipeEntity[]> {
    return this.recipeRepository.find();
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

  async create(recipe: RecipeEntity): Promise<RecipeEntity> {
    return this.recipeRepository.save(recipe);
  }

  async update(id: string, recipe: RecipeEntity): Promise<RecipeEntity> {
    const persistedRecipe = await this.recipeRepository.findOne({
      where: { id },
    });
    if (!persistedRecipe) {
      throw new BusinessLogicException(
        "The recipe with the given id was not found",
        BusinessError.NOT_FOUND,
      );
    }
    return this.recipeRepository.save({ ...persistedRecipe, ...recipe });
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
