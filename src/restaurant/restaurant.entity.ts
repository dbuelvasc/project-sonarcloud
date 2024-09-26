import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  ManyToOne,
} from "typeorm";
import { GastronomicCultureEntity } from "@/gastronomicCulture/gastronomicCulture.entity";
import { CountryEntity } from "@/country/country.entity";
import { Field, ObjectType } from '@nestjs/graphql';

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
  awardDate: Date;

  
  @ManyToMany(
    () => GastronomicCultureEntity,
    (gastronomicCulture) => gastronomicCulture.restaurants,
  )
  gastronomicCulture: GastronomicCultureEntity[];

  @Field(type => CountryEntity)
  @ManyToOne(() => CountryEntity, (country) => country.restaurants)
  country: CountryEntity;
}
