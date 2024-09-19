import { IsString, IsNotEmpty } from 'class-validator';

export class CharacteristicproductDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @IsString()
  @IsNotEmpty()
  readonlyhistory: string;

  @IsString()
  @IsNotEmpty()
  readonly category: string;
}
