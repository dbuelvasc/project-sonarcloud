/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { CharacteristicproductService } from './characteristicproduct.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CharacteristicproductEntity } from './characteristicproduct.entity/characteristicproduct.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CharacteristicproductEntity])],
  providers: [CharacteristicproductService]
})
export class CharacteristicproductModule {}
