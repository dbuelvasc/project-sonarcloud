import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantService } from './restaurant.service';
import { RestaurantEntity } from './restaurant.entity/restaurant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RestaurantEntity])],
  providers: [RestaurantService],
})
export class RestaurantModule {}
