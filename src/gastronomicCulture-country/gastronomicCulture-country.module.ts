import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as sqliteStore from "cache-manager-sqlite";

import { CountryEntity } from "@/country/country.entity";
import { GastronomicCultureEntity } from "@/gastronomicCulture/gastronomicCulture.entity";
import { CountryGastronomicCultureController } from "./country-gastronomicCulture.controller";
import { GastronomicCultureCountryController } from "./gastronomicCulture-country.controller";
import { GastronomicCultureCountryService } from "./gastronomicCulture-country.service";

@Module({
  providers: [GastronomicCultureCountryService],
  controllers: [
    CountryGastronomicCultureController,
    GastronomicCultureCountryController,
  ],
  imports: [
    TypeOrmModule.forFeature([GastronomicCultureEntity, CountryEntity]),
    CacheModule.register({
      store: sqliteStore,
      options: {
        ttl: 5,
      },
      path: ":memory:",
    }),
  ],
})
export class GastronomicCultureCountryModule {}
