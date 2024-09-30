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
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
@Entity()
export class GastronomicCultureEntity {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column()
  name: string;

  @Field(() => [CharacteristicProductEntity])
  @OneToMany(
    () => CharacteristicProductEntity,
    (characteristicProduct) => characteristicProduct.gastronomicCulture,
  )
  characteristicProducts: CharacteristicProductEntity[];

  @Field(() => [RestaurantEntity])
  @ManyToMany(
    () => RestaurantEntity,
    (restaurant) => restaurant.gastronomicCultures,
  )
  @JoinTable()
  restaurants: RestaurantEntity[];

  @Field(() => [CountryEntity])
  @ManyToMany(() => CountryEntity, (country) => country.gastronomicCultures)
  @JoinTable()
  countries: CountryEntity[];

  @Field(() => [RecipeEntity])
  @OneToMany(() => RecipeEntity, (recipe) => recipe.gastronomicCulture)
  recipes: RecipeEntity[];
}
