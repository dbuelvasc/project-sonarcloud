import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CharacteristicProductEntity } from './characteristicProduct/characteristicProduct.entity';
import { CharacteristicProductModule } from './characteristicProduct/characteristicProduct.module';
import { CountryRestaurantController } from './country-restaurant/country-restaurant.controller';
import { CountryRestaurantModule } from './country-restaurant/country-restaurant.module';
import { CountryEntity } from './country/country.entity';
import { CountryModule } from './country/country.module';
import { GastronomicCultureEntity } from './gastronomicCulture/gastronomicCulture.entity';
import { GastronomicCultureModule } from './gastronomicCulture/gastronomicCulture.module';
import { RecipeEntity } from './recipe/recipe.entity';
import { RecipeModule } from './recipe/recipe.module';
import { RestaurantEntity } from './restaurant/restaurant.entity';
import { RestaurantModule } from './restaurant/restaurant.module';
@Module({
  imports: [
    RestaurantModule,
    GastronomicCultureModule,
    CharacteristicProductModule,
    RecipeModule,
    CountryModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      entities: [
        RestaurantEntity,
        GastronomicCultureEntity,
        CharacteristicProductEntity,
        RecipeEntity,
        CountryEntity,
      ],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true,
    }),
    CountryRestaurantModule,
  ],
  controllers: [AppController, CountryRestaurantController],
  providers: [AppService],
})
export class AppModule {}
