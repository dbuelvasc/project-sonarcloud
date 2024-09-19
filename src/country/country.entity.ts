import { GastronomicCultureEntity } from "../gastronomicCulture/gastronomicCulture.entity";
import { RestaurantEntity } from "../restaurant/restaurant.entity";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from "typeorm";

@Entity()
export class CountryEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @OneToMany(() => RestaurantEntity, (restaurant) => restaurant.country)
  @JoinTable()
  restaurants: RestaurantEntity[];

  @ManyToMany(
    () => GastronomicCultureEntity,
    (gastronomicCulture) => gastronomicCulture.countries,
  )
  gastronomicCultures: GastronomicCultureEntity[];
}
