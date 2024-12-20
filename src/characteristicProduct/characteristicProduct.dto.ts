import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsString } from "class-validator";

@InputType()
export class CharacteristicProductDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  readonly history: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  readonly category: string;
}
