import { Module } from "@nestjs/common";
import { RecipeService } from "./recipe.service";
import { RecipeEntity } from "./recipe.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  providers: [RecipeService],
  imports: [TypeOrmModule.forFeature([RecipeEntity])],
})
export class RecipeModule {}
