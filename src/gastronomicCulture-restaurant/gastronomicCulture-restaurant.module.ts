import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as sqliteStore from "cache-manager-sqlite";

import { RestaurantEntity } from "@/restaurant/restaurant.entity";
import { GastronomicCultureEntity } from "@/gastronomicCulture/gastronomicCulture.entity";
import { RestaurantGastronomicCultureController } from "./restaurant-gastronomicCulture.controller";
import { GastronomicCultureRestaurantController } from "./gastronomicCulture-restaurant.controller";
import { GastronomicCultureRestaurantService } from "./gastronomicCulture-restaurant.service";

@Module({
  providers: [GastronomicCultureRestaurantService],
  controllers: [
    RestaurantGastronomicCultureController,
    GastronomicCultureRestaurantController,
  ],
  imports: [
    TypeOrmModule.forFeature([GastronomicCultureEntity, RestaurantEntity]),
    CacheModule.register({
      store: sqliteStore,
      options: {
        ttl: 5,
      },
      path: ":memory:",
    }),
  ],
})
export class GastronomicCultureRestaurantModule {}
