import { Field, InputType } from "@nestjs/graphql";
import { IsDateString, IsNotEmpty, IsNumber, IsString } from "class-validator";

@InputType()
export class RestaurantDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  readonly city: string;

  @Field()
  @IsNumber()
  @IsNotEmpty()
  readonly michelinStars: number;

  @Field()
  @IsDateString()
  @IsNotEmpty()
  readonly awardDate: string;
}
