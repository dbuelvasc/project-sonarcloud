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
import {
  BusinessErrorsInterceptor,
  UUIDValidationInterceptor,
} from "@/shared/interceptors";
import { UserRoles } from "@/shared/security/userRoles";
import { RecipeDto } from "./recipe.dto";
import { RecipeService } from "./recipe.service";

@Controller("recipes")
@UseInterceptors(
  BusinessErrorsInterceptor,
  new UUIDValidationInterceptor("recipeId"),
)
@UseGuards(JwtAuthGuard, RoleGuard)
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Get()
  @Roles(UserRoles.ADMIN, UserRoles.FULL_READER)
  async findAll() {
    return await this.recipeService.findAll();
  }

  @Get(":recipeId")
  @Roles(UserRoles.ADMIN, UserRoles.FULL_READER, UserRoles.LIMITED_READER)
  async findOne(@Param("recipeId") recipeId: string) {
    return await this.recipeService.findOne(recipeId);
  }

  @Post()
  @Roles(UserRoles.ADMIN, UserRoles.WRITER)
  async create(@Body() recipeDto: RecipeDto) {
    return await this.recipeService.create(recipeDto);
  }

  @Put(":recipeId")
  @Roles(UserRoles.ADMIN, UserRoles.WRITER)
  async update(
    @Param("recipeId") recipeId: string,
    @Body() recipeDto: RecipeDto,
  ) {
    return await this.recipeService.update(recipeId, recipeDto);
  }

  @Delete(":recipeId")
  @Roles(UserRoles.ADMIN, UserRoles.DELETE)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param("recipeId") recipeId: string) {
    return await this.recipeService.delete(recipeId);
  }
}
