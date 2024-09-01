import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne} from "typeorm";
import { UUID } from "typeorm/driver/mongodb/bson.typings";
import { GastronomicCultureEntity } from "../../gastronomic-culture/gastronomic-culture.entity/gastronomic-culture.entity";
import { CountryEntity } from "../../country/country.entity/country.entity";

@Entity()
export class RestaurantEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @Column()
    city: string;

    @Column()
    michelinStars: number;

    @Column()
    awardDate: Date;
    
    @ManyToMany(() => GastronomicCultureEntity, (gastronomicCulture) => gastronomicCulture.restaurants)
    gastronomicCulture: GastronomicCultureEntity[];

    @ManyToOne(() => CountryEntity, (country) => country.restaurants)
    country: CountryEntity;   
    
}
