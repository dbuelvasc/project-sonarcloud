import { TypeOrmModule } from '@nestjs/typeorm';
import { CharacteristicProductEntity } from '../../characteristicProduct/characteristicProduct.entity';
import { CountryEntity } from '../../country/country.entity';
import { GastronomicCultureEntity } from '../../gastronomicCulture/gastronomicCulture.entity';
import { RecipeEntity } from '../../recipe/recipe.entity';
import { RestaurantEntity } from '../../restaurant/restaurant.entity';

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
