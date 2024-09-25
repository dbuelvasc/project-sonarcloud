import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { GastronomicCultureEntity } from "@/gastronomicCulture/gastronomicCulture.entity";

@Entity()
export class CharacteristicProductEntity {
  @PrimaryGeneratedColumn("uuid")
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
    (gastronomicCulture) => gastronomicCulture.characteristicProducts,
  )
  gastronomicCulture: GastronomicCultureEntity;
}
