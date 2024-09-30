import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

@InputType()
export class RecipeDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  description: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  photo: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  preparationProcess: string;

  @Field()
  @IsString()
  @IsOptional()
  video?: string;
}
