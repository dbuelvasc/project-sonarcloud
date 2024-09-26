import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as sqliteStore from "cache-manager-sqlite";

import { GastronomicCultureController } from "./gastronomicCulture.controller";
import { GastronomicCultureEntity } from "./gastronomicCulture.entity";
import { GastronomicCultureService } from "./gastronomicCulture.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([GastronomicCultureEntity]),
    CacheModule.register({
      store: sqliteStore,
      options: {
        ttl: 5,
      },
      path: ":memory:",
    }),
  ],
  providers: [GastronomicCultureService],
  controllers: [GastronomicCultureController],
})
export class GastronomicCultureModule {}
