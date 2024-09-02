/* eslint-disable prettier/prettier */
import { Entity, Column, OneToMany, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { CharacteristicProductEntity } from '../../characteristicproduct/characteristicproduct.entity/characteristicproduct.entity';
import { RestaurantEntity } from "../../restaurant/restaurant.entity/restaurant.entity";
import { CountryEntity } from "../../country/country.entity/country.entity";
import { RecipeEntity } from "../../recipe/recipe.entity/recipe.entity";

@Entity()
export class GastronomicCultureEntity {
   
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;
    
    @OneToMany(() => CharacteristicProductEntity, characteristicproduct => characteristicproduct.gastronomicCulture)
    characteristicproducts: CharacteristicProductEntity[];
    
    @ManyToMany(() => RestaurantEntity, restaurant => restaurant.gastronomicCulture)
    restaurants: RestaurantEntity[];

    @ManyToMany(() => CountryEntity, country => country.gastronomicCultures)
    countries: CountryEntity[];
    
    @OneToMany(() => RecipeEntity, recipe => recipe.gastronomicCulture)
    recipes: RecipeEntity[];
}
