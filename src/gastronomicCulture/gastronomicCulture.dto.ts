import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsString } from "class-validator";

@InputType()
export class GastronomicCultureDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;
}
