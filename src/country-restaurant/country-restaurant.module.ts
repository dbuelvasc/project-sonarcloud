import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as sqliteStore from "cache-manager-sqlite";

import { CountryEntity } from "@/country/country.entity";
import { RestaurantEntity } from "@/restaurant/restaurant.entity";
import { CountryRestaurantController } from "./country-restaurant.controller";
import { CountryRestaurantResolver } from "./country-restaurant.resolver";
import { CountryRestaurantService } from "./country-restaurant.service";

@Module({
  providers: [CountryRestaurantService, CountryRestaurantResolver],
  controllers: [CountryRestaurantController],
  imports: [
    TypeOrmModule.forFeature([CountryEntity, RestaurantEntity]),
    CacheModule.register({
      store: sqliteStore,
      options: {
        ttl: 5,
      },
      path: ":memory:",
    }),
  ],
})
export class CountryRestaurantModule {}
