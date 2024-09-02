import { Module } from '@nestjs/common';
import { CountryService } from './country.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountryEntity } from './country.entity/country.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CountryEntity])],
  providers: [CountryService]
})
export class CountryModule {}
