import { IsNotEmpty, IsString, IsArray } from 'class-validator';

export class CountryDto {
    @IsString()
    @IsNotEmpty()
    readonly name: string;
}
