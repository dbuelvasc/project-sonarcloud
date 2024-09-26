import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { GastronomicCultureEntity } from "@/gastronomicCulture/gastronomicCulture.entity";

@ObjectType()
@Entity()
export class CharacteristicProductEntity {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  description: string;

  @Field()
  @Column()
  history: string;

  @Field()
  @Column()
  category: string;

  // @Field(() => GastronomicCultureEntity)
  @ManyToOne(
    () => GastronomicCultureEntity,
    (gastronomicCulture) => gastronomicCulture.characteristicProducts,
  )
  gastronomicCulture: GastronomicCultureEntity;
}
