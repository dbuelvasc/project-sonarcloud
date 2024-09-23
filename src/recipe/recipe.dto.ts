import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class RecipeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  photo: string;

  @IsString()
  @IsNotEmpty()
  preparationProcess: string;

  @IsString()
  @IsOptional()
  video?: string;
}
