import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { RecipeController } from "./recipe.controller";
import { RecipeEntity } from "./recipe.entity";
import { RecipeService } from "./recipe.service";

@Module({
  providers: [RecipeService],
  imports: [TypeOrmModule.forFeature([RecipeEntity])],
  controllers: [RecipeController],
})
export class RecipeModule {}
