import { GastronomicCultureEntity } from '../gastronomic-culture/gastronomic-culture.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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
    (gastronomicCulture) => gastronomicCulture.characteristicproducts,
  )
  gastronomicCulture: GastronomicCultureEntity;
}
