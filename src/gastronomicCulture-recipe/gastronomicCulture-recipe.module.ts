import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as sqliteStore from "cache-manager-sqlite";

import { RecipeEntity } from "@/recipe/recipe.entity";
import { GastronomicCultureEntity } from "@/gastronomicCulture/gastronomicCulture.entity";
import { GastronomicCultureRecipeController } from "./gastronomicCulture-recipe.controller";
import { GastronomicCultureRecipeService } from "./gastronomicCulture-recipe.service";
import { GastronomicCultureRecipeResolver } from "./gastronomicCulture-recipe.resolver";

@Module({
  providers: [
    GastronomicCultureRecipeService,
    GastronomicCultureRecipeResolver,
  ],
  controllers: [GastronomicCultureRecipeController],
  imports: [
    TypeOrmModule.forFeature([GastronomicCultureEntity, RecipeEntity]),
    CacheModule.register({
      store: sqliteStore,
      options: {
        ttl: 5,
      },
      path: ":memory:",
    }),
  ],
})
export class GastronomicCultureRecipeModule {}
