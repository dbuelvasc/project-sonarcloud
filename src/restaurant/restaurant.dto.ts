import { IsDateString, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class RestaurantDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly city: string;

  @IsNumber()
  @IsNotEmpty()
  readonly michelinStars: number;

  @IsString()
  @IsDateString()
  @IsNotEmpty()
  readonly awardDate: Date;
}
