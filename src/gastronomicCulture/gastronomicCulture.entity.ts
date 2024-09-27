import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

import { CharacteristicProductEntity } from "@/characteristicProduct/characteristicProduct.entity";
import { CountryEntity } from "@/country/country.entity";
import { RecipeEntity } from "@/recipe/recipe.entity";
import { RestaurantEntity } from "@/restaurant/restaurant.entity";

@Entity()
export class GastronomicCultureEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @OneToMany(
    () => CharacteristicProductEntity,
    (characteristicProduct) => characteristicProduct.gastronomicCulture,
  )
  characteristicProducts: CharacteristicProductEntity[];

  @ManyToMany(
    () => RestaurantEntity,
    (restaurant) => restaurant.gastronomicCultures,
  )
  @JoinTable()
  restaurants: RestaurantEntity[];

  @ManyToMany(() => CountryEntity, (country) => country.gastronomicCultures)
  @JoinTable()
  countries: CountryEntity[];

  @OneToMany(() => RecipeEntity, (recipe) => recipe.gastronomicCulture)
  recipes: RecipeEntity[];
}
