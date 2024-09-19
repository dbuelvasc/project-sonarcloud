import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RestaurantModule } from './restaurant/restaurant.module';
import { RestaurantEntity } from './restaurant/restaurant.entity';
import { GastronomicCultureModule } from './gastronomic-culture/gastronomic-culture.module';
import { GastronomicCultureEntity } from './gastronomic-culture/gastronomic-culture.entity';
import { CharacteristicproductModule } from './characteristicproduct/characteristicproduct.module';
import { CharacteristicProductEntity } from './characteristicproduct/characteristicproduct.entity';
import { RecipeModule } from './recipe/recipe.module';
import { RecipeEntity } from './recipe/recipe.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountryModule } from './country/country.module';
import { CountryEntity } from './country/country.entity';
import { CountryRestaurantController } from './country-restaurant/country-restaurant.controller';
import { CountryRestaurantModule } from './country-restaurant/country-restaurant.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    RestaurantModule,
    GastronomicCultureModule,
    CharacteristicproductModule,
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
    UserModule,
    CountryRestaurantModule,
  ],
  controllers: [AppController, CountryRestaurantController],
  providers: [AppService],
})
export class AppModule {}
