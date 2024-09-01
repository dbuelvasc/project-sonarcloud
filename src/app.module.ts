/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RestaurantModule } from './restaurant/restaurant.module';
import { GastronomicCultureModule } from './gastronomic-culture/gastronomic-culture.module';
import { CharacteristicproductModule } from './characteristicproduct/characteristicproduct.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipeModule } from './recipe/recipe.module';
import { RecipeEntity } from './recipe/recipe.entity/recipe.entity';

@Module({
  imports: [RestaurantModule, GastronomicCultureModule, CharacteristicproductModule, RecipeModule,
  TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'postgres',
    entities: [RestaurantModule, GastronomicCultureModule, CharacteristicproductModule, RecipeModule],
    dropSchema: true,
    synchronize: true,
    keepConnectionAlive: true
  }),  
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
