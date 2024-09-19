/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as sqliteStore from 'cache-manager-sqlite';

import { CountryRestaurantService } from './country-restaurant.service';
import { CountryEntity } from 'src/country/country.entity';
import { RestaurantEntity } from '../restaurant/restaurant.entity';

@Module({
  providers: [CountryRestaurantService,],
  imports: [
    TypeOrmModule.forFeature([CountryEntity, RestaurantEntity]),
    CacheModule.register({
      store: sqliteStore,
      options: {
        ttl: 30,
      },
      path: ':memory:',
    }),
  ],
  exports: [CountryRestaurantService],
})
export class CountryRestaurantModule {}
