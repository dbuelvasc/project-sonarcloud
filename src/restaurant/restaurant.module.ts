import { Module } from "@nestjs/common";
import { CacheModule } from "@nestjs/cache-manager";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RestaurantService } from "./restaurant.service";
import { RestaurantEntity } from "./restaurant.entity";
import { RestaurantController } from "./restaurant.controller";
import { RestaurantResolver } from './restaurant.resolver';
import * as sqliteStore from "cache-manager-sqlite";

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
