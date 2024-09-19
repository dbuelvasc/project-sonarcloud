import { Module } from "@nestjs/common";
import { CharacteristicProductService } from "./characteristicProduct.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CharacteristicProductEntity } from "./characteristicProduct.entity";
import { CharacteristicProductController } from "./characteristicProduct.controller";

@Module({
  imports: [TypeOrmModule.forFeature([CharacteristicProductEntity])],
  providers: [CharacteristicProductService],
  controllers: [CharacteristicProductController],
})
export class CharacteristicProductModule {}
