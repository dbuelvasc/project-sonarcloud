import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { GastronomicCultureController } from "./gastronomicCulture.controller";
import { GastronomicCultureEntity } from "./gastronomicCulture.entity";
import { GastronomicCultureService } from "./gastronomicCulture.service";

@Module({
  imports: [TypeOrmModule.forFeature([GastronomicCultureEntity])],
  providers: [GastronomicCultureService],
  controllers: [GastronomicCultureController],
})
export class GastronomicCultureModule {}
