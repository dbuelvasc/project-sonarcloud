import { Module } from '@nestjs/common';
import { CharacteristicProductService } from './characteristicproduct.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CharacteristicProductEntity } from './characteristicproduct.entity';
import { CharacteristicproductController } from './characteristicproduct.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CharacteristicProductEntity])],
  providers: [CharacteristicProductService],
  controllers: [CharacteristicproductController],
})
export class CharacteristicProductModule {}
