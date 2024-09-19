import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class RestaurantDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsNumber()
  @IsNotEmpty()
  michelinStars: number;

  @IsDate()
  @IsNotEmpty()
  awardDate: Date;
}
