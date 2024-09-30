import { Field, ObjectType } from "@nestjs/graphql";
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { CountryEntity } from "@/country/country.entity";
import { GastronomicCultureEntity } from "@/gastronomicCulture/gastronomicCulture.entity";

@ObjectType()
@Entity()
export class RestaurantEntity {
  @PrimaryGeneratedColumn("uuid")
  @Field()
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  city: string;

  @Field()
  @Column()
  michelinStars: number;

  @Field()
  @Column()
  awardDate: string;

  @ManyToMany(
    () => GastronomicCultureEntity,
    (gastronomicCulture) => gastronomicCulture.restaurants,
  )
  gastronomicCultures: GastronomicCultureEntity[];

  @Field(() => CountryEntity, { nullable: true })
  @ManyToOne(() => CountryEntity, (country) => country.restaurants)
  country: CountryEntity;
}
