import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as sqliteStore from "cache-manager-sqlite";

import { RecipeController } from "./recipe.controller";
import { RecipeEntity } from "./recipe.entity";
import { RecipeResolver } from "./recipe.resolver";
import { RecipeService } from "./recipe.service";

@Module({
  providers: [RecipeService, RecipeResolver],
  imports: [
    TypeOrmModule.forFeature([RecipeEntity]),
    CacheModule.register({
      store: sqliteStore,
      options: {
        ttl: 5,
      },
      path: ":memory:",
    }),
  ],
  controllers: [RecipeController],
})
export class RecipeModule {}
