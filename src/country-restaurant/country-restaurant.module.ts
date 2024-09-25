import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as sqliteStore from "cache-manager-sqlite";

import { CountryEntity } from "@/country/country.entity";
import { RestaurantEntity } from "@/restaurant/restaurant.entity";
import { CountryRestaurantService } from "./country-restaurant.service";
import { CountryRestaurantController } from "./country-restaurant.controller";

@Module({
  providers: [CountryRestaurantService],
  controllers: [CountryRestaurantController],
  imports: [
    TypeOrmModule.forFeature([CountryEntity, RestaurantEntity]),
    CacheModule.register({
      store: sqliteStore,
      options: {
        ttl: 30,
      },
      path: ":memory:",
    }),
  ],
})
export class CountryRestaurantModule {}
