import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors,
} from "@nestjs/common";

import {
  BusinessErrorsInterceptor,
  UUIDValidationInterceptor,
} from "@/shared/interceptors";
import { RecipeDto } from "./recipe.dto";
import { RecipeService } from "./recipe.service";

@Controller("recipes")
@UseInterceptors(
  BusinessErrorsInterceptor,
  new UUIDValidationInterceptor("recipeId"),
)
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Get()
  async findAll() {
    return await this.recipeService.findAll();
  }

  @Get(":recipeId")
  async findOne(@Param("recipeId") recipeId: string) {
    return await this.recipeService.findOne(recipeId);
  }

  @Post()
  async create(@Body() recipeDto: RecipeDto) {
    return await this.recipeService.create(recipeDto);
  }

  @Put(":recipeId")
  async update(
    @Param("recipeId") recipeId: string,
    @Body() recipeDto: RecipeDto,
  ) {
    return await this.recipeService.update(recipeId, recipeDto);
  }

  @Delete(":recipeId")
  @HttpCode(204)
  async delete(@Param("recipeId") recipeId: string) {
    return await this.recipeService.delete(recipeId);
  }
}
