import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";

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

  @IsDate()
  @IsNotEmpty()
  readonly awardDate: Date;
}
