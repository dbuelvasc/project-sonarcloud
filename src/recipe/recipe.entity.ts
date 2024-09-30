import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { GastronomicCultureEntity } from "@/gastronomicCulture/gastronomicCulture.entity";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
@Entity()
export class RecipeEntity {
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
  photo: string;

  @Field()
  @Column()
  preparationProcess: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  video?: string;

  @Field(() => GastronomicCultureEntity, { nullable: true })
  @ManyToOne(
    () => GastronomicCultureEntity,
    (gastronomicCulture) => gastronomicCulture.recipes,
  )
  gastronomicCulture: GastronomicCultureEntity;
}
