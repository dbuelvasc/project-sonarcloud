import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { GastronomicCultureEntity } from '../gastronomicCulture/gastronomicCulture.entity';

@Entity()
export class RecipeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  photo: string;

  @Column()
  preparationProcess: string;

  @Column({ nullable: true })
  video?: string;

  @ManyToOne(
    () => GastronomicCultureEntity,
    (gastronomicCulture) => gastronomicCulture.recipes,
  )
  gastronomicCulture: GastronomicCultureEntity;
}
