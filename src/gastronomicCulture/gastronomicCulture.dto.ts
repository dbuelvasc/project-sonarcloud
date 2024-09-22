import { IsNotEmpty, IsString } from "class-validator";

export class GastronomicCultureDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
