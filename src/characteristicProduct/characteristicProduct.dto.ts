import { IsString, IsNotEmpty } from "class-validator";

export class CharacteristicProductDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @IsString()
  @IsNotEmpty()
  readonly history: string;

  @IsString()
  @IsNotEmpty()
  readonly category: string;
}
