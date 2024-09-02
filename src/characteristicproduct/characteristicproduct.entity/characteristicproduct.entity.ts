/* eslint-disable prettier/prettier */
import { Column, ManyToOne, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { GastronomicCultureEntity } from '../../gastronomic-culture/gastronomic-culture.entity/gastronomic-culture.entity';
import { Category } from './category.enum';

@Entity()
export class CharacteristicProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  history: string;

  // Cambia el tipo de dato de enum a string
  @Column()
  category: string;

  @ManyToOne(
    () => GastronomicCultureEntity,
    (gastronomicCulture) => gastronomicCulture.characteristicproducts)
  gastronomicCulture: GastronomicCultureEntity;
}
