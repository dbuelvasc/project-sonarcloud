import { Module } from '@nestjs/common';
import { CountryRestaurantService } from './country-restaurant.service';

@Module({
  providers: [CountryRestaurantService]
})
export class CountryRestaurantModule {}
