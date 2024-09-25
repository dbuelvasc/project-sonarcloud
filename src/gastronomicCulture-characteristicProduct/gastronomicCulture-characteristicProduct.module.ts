import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as sqliteStore from "cache-manager-sqlite";

import { GastronomicCultureCharacteristicProductController } from "./gastronomicCulture-characteristicProduct.controller";
import { GastronomicCultureCharacteristicProductService } from "./gastronomicCulture-characteristicProduct.service";
import { GastronomicCultureEntity } from "@/gastronomicCulture/gastronomicCulture.entity";
import { CharacteristicProductEntity } from "@/characteristicProduct/characteristicProduct.entity";

@Module({
  providers: [GastronomicCultureCharacteristicProductService],
  controllers: [GastronomicCultureCharacteristicProductController],
  imports: [
    TypeOrmModule.forFeature([
      GastronomicCultureEntity,
      CharacteristicProductEntity,
    ]),
    CacheModule.register({
      store: sqliteStore,
      options: {
        ttl: 30,
      },
      path: ":memory:",
    }),
  ],
})
export class GastronomicCultureCharacteristicProductModule {}
