/* eslint-disable prettier/prettier */
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { GastronomicCultureEntity } from '../../gastronomic-culture/gastronomic-culture.entity/gastronomic-culture.entity';

@Entity()
export class CharacteristicproductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  history: string;

  @Column()
  category: string;

  @ManyToOne(
    () => GastronomicCultureEntity,
    (gastronomicCulture) => gastronomicCulture.characteristicproducts)
  gastronomicCulture: GastronomicCultureEntity;
}
