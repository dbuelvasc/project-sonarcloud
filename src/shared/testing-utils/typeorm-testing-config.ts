/* eslint-disable prettier/prettier */
import { TypeOrmModule } from '@nestjs/typeorm';
import { CharacteristicproductEntity } from 'src/characteristicproduct/characteristicproduct.entity/characteristicproduct.entity';
import { CountryEntity } from 'src/country/country.entity/country.entity';
import { GastronomicCultureEntity } from 'src/gastronomic-culture/gastronomic-culture.entity/gastronomic-culture.entity';
import { RecipeEntity } from 'src/recipe/recipe.entity/recipe.entity';
import { RestaurantEntity } from 'src/restaurant/restaurant.entity/restaurant.entity';


export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [      
      RecipeEntity,
      RestaurantEntity,
      CountryEntity,     
      CharacteristicproductEntity,
      GastronomicCultureEntity,
    ],
    synchronize: true,
    keepConnectionAlive: true,
  }),
  TypeOrmModule.forFeature([
    RecipeEntity,
    RestaurantEntity,
    CountryEntity,     
    CharacteristicproductEntity,
    GastronomicCultureEntity,
  ]),
];