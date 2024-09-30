import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as sqliteStore from "cache-manager-sqlite";

import { CharacteristicProductEntity } from "@/characteristicProduct/characteristicProduct.entity";
import { GastronomicCultureEntity } from "@/gastronomicCulture/gastronomicCulture.entity";
import { GastronomicCultureCharacteristicProductController } from "./gastronomicCulture-characteristicProduct.controller";
import { GastronomicCultureCharacteristicProductResolver } from "./gastronomicCulture-characteristicProduct.resolver";
import { GastronomicCultureCharacteristicProductService } from "./gastronomicCulture-characteristicProduct.service";

@Module({
  providers: [
    GastronomicCultureCharacteristicProductService,
    GastronomicCultureCharacteristicProductResolver,
  ],
  controllers: [GastronomicCultureCharacteristicProductController],
  imports: [
    TypeOrmModule.forFeature([
      GastronomicCultureEntity,
      CharacteristicProductEntity,
    ]),
    CacheModule.register({
      store: sqliteStore,
      options: {
        ttl: 5,
      },
      path: ":memory:",
    }),
  ],
})
export class GastronomicCultureCharacteristicProductModule {}
