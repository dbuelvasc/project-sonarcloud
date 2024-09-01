/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RestaurantModule } from './restaurant/restaurant.module';
import { RestaurantEntity } from './restaurant/restaurant.entity/restaurant.entity';
import { GastronomicCultureModule } from './gastronomic-culture/gastronomic-culture.module';
import { GastronomicCultureEntity } from './gastronomic-culture/gastronomic-culture.entity/gastronomic-culture.entity';
import { CharacteristicproductModule } from './characteristicproduct/characteristicproduct.module';
import { CharacteristicproductEntity } from './characteristicproduct/characteristicproduct.entity/characteristicproduct.entity';
import { RecipeModule } from './recipe/recipe.module';
import { RecipeEntity } from './recipe/recipe.entity/recipe.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountryModule } from './country/country.module';
import { CountryEntity } from './country/country.entity/country.entity';
@Module({
  imports: [RestaurantModule, GastronomicCultureModule, CharacteristicproductModule, RecipeModule, CountryModule,
  TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'postgres',
    entities: [RestaurantEntity, GastronomicCultureEntity, CharacteristicproductEntity, RecipeEntity, CountryEntity],
    dropSchema: true,
    synchronize: true,
    keepConnectionAlive: true
  }),    
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
