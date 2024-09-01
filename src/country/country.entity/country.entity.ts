/* eslint-disable prettier/prettier */
import { GastronomicCultureEntity } from 'src/gastronomic-culture/gastronomic-culture.entity/gastronomic-culture.entity';
import { RestaurantEntity } from 'src/restaurant/restaurant.entity/restaurant.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';

@Entity()
export class CountryEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @ManyToMany(() => RestaurantEntity, (restaurant) => restaurant.country)
    @JoinTable()
    restaurants: RestaurantEntity[];

    @ManyToMany(() => GastronomicCultureEntity, (gastronomicCulture) => gastronomicCulture.country)
    @JoinTable()
    gastronomicCultures: GastronomicCultureEntity[];
    
}
