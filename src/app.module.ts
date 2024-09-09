import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RestaurantModule } from './restaurant/restaurant.module';
import { RestaurantEntity } from './restaurant/restaurant.entity';
import { GastronomicCultureModule } from './gastronomicCulture/gastronomicCulture.module';
import { GastronomicCultureEntity } from './gastronomicCulture/gastronomicCulture.entity';
import { CharacteristicProductModule } from './characteristicProduct/characteristicProduct.module';
import { CharacteristicProductEntity } from './characteristicProduct/characteristicProduct.entity';
import { RecipeModule } from './recipe/recipe.module';
import { RecipeEntity } from './recipe/recipe.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountryModule } from './country/country.module';
import { CountryEntity } from './country/country.entity';
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
