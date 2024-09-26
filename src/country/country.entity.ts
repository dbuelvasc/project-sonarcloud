import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

import { GastronomicCultureEntity } from "@/gastronomicCulture/gastronomicCulture.entity";
import { RestaurantEntity } from "@/restaurant/restaurant.entity";
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class CountryEntity {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column()
  name: string;

  @Field(type => [RestaurantEntity])
  @OneToMany(() => RestaurantEntity, (restaurant) => restaurant.country)
  @JoinTable()
  restaurants: RestaurantEntity[];

  
  @ManyToMany(
    () => GastronomicCultureEntity,
    (gastronomicCulture) => gastronomicCulture.countries,
  )
  gastronomicCultures: GastronomicCultureEntity[];
}
