import { Module } from '@nestjs/common';
import { CharacteristicProductService } from './characteristicproduct.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CharacteristicProductEntity } from './characteristicproduct.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CharacteristicProductEntity])],
  providers: [CharacteristicProductService],
})
export class CharacteristicProductModule {}
