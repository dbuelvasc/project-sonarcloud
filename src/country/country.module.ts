import { Module } from "@nestjs/common";
import { CacheModule } from "@nestjs/cache-manager";
import { CountryService } from "./country.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CountryEntity } from "./country.entity";
import { CountryController } from "./country.controller";
import * as sqliteStore from "cache-manager-sqlite";

@Module({
  imports: [
    TypeOrmModule.forFeature([CountryEntity]),
    CacheModule.register({
      store: sqliteStore,
      options: {
        ttl: 30,
      },
      path: ":memory:",
    }),
  ],
  providers: [CountryService],
  controllers: [CountryController],
})
export class CountryModule {}
