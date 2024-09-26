import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as sqliteStore from "cache-manager-sqlite";

import { CharacteristicProductController } from "./characteristicProduct.controller";
import { CharacteristicProductEntity } from "./characteristicProduct.entity";
import { CharacteristicProductService } from "./characteristicProduct.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([CharacteristicProductEntity]),
    CacheModule.register({
      store: sqliteStore,
      options: {
        ttl: 5,
      },
      path: ":memory:",
    }),
  ],
  providers: [CharacteristicProductService],
  controllers: [CharacteristicProductController],
})
export class CharacteristicProductModule {}
