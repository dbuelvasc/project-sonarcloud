import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as sqliteStore from "cache-manager-sqlite";

import { CountryController } from "./country.controller";
import { CountryEntity } from "./country.entity";
import { CountryResolver } from "./country.resolver";
import { CountryService } from "./country.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([CountryEntity]),
    CacheModule.register({
      store: sqliteStore,
      options: {
        ttl: 5,
      },
      path: ":memory:",
    }),
  ],
  providers: [CountryService, CountryResolver],
  controllers: [CountryController],
})
export class CountryModule {}
