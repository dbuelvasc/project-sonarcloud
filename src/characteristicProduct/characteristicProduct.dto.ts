import { InputType, Field } from "@nestjs/graphql";
import { IsString, IsNotEmpty } from "class-validator";

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
