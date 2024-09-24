import { Module } from "@nestjs/common";
import { CacheModule } from "@nestjs/cache-manager";
import { CharacteristicProductService } from "./characteristicProduct.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CharacteristicProductEntity } from "./characteristicProduct.entity";
import { CharacteristicProductController } from "./characteristicProduct.controller";

@Module({
  imports: [TypeOrmModule.forFeature([CharacteristicProductEntity]),  CacheModule.register()],
  providers: [CharacteristicProductService],
  controllers: [CharacteristicProductController],
})
export class CharacteristicProductModule {}
