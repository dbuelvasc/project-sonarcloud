import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as sqliteStore from "cache-manager-sqlite";

import { RestaurantController } from "./restaurant.controller";
import { RestaurantEntity } from "./restaurant.entity";
import { RestaurantResolver } from "./restaurant.resolver";
import { RestaurantService } from "./restaurant.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([RestaurantEntity]),
    CacheModule.register({
      store: sqliteStore,
      options: {
        ttl: 5,
      },
      path: ":memory:",
    }),
  ],
  providers: [RestaurantService, RestaurantResolver],
  controllers: [RestaurantController],
})
export class RestaurantModule {}
