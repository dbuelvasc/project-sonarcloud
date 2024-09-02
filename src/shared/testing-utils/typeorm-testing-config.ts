/* eslint-disable prettier/prettier */
import { TypeOrmModule } from '@nestjs/typeorm';
import { CharacteristicProductEntity } from '../../characteristicproduct/characteristicproduct.entity/characteristicproduct.entity';
import { CountryEntity } from '../../country/country.entity/country.entity';
import { GastronomicCultureEntity } from '../../gastronomic-culture/gastronomic-culture.entity/gastronomic-culture.entity';
import { RecipeEntity } from '../../recipe/recipe.entity/recipe.entity';
import { RestaurantEntity } from '../../restaurant/restaurant.entity/restaurant.entity';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [
      RecipeEntity,
      RestaurantEntity,
      CountryEntity,
      CharacteristicProductEntity,
      GastronomicCultureEntity,
    ],
    synchronize: true,
    keepConnectionAlive: true,
  }),
  TypeOrmModule.forFeature([
    RecipeEntity,
    RestaurantEntity,
    CountryEntity,
    CharacteristicProductEntity,
    GastronomicCultureEntity,
  ]),
];
