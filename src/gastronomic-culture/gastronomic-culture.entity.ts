import {
  Entity,
  Column,
  OneToMany,
  ManyToMany,
  PrimaryGeneratedColumn,
  JoinTable,
} from 'typeorm';
import { CharacteristicProductEntity } from '../characteristicproduct/characteristicproduct.entity';
import { RestaurantEntity } from '../restaurant/restaurant.entity';
import { CountryEntity } from '../country/country.entity';
import { RecipeEntity } from '../recipe/recipe.entity';

@Entity()
export class GastronomicCultureEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(
    () => CharacteristicProductEntity,
    (characteristicproduct) => characteristicproduct.gastronomicCulture,
  )
  characteristicproducts: CharacteristicProductEntity[];

  @ManyToMany(
    () => RestaurantEntity,
    (restaurant) => restaurant.gastronomicCulture,
  )
  @JoinTable()
  restaurants: RestaurantEntity[];

  @ManyToMany(() => CountryEntity, (country) => country.gastronomicCultures)
  @JoinTable()
  countries: CountryEntity[];

  @OneToMany(() => RecipeEntity, (recipe) => recipe.gastronomicCulture)
  recipes: RecipeEntity[];
}
