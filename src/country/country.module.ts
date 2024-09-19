import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { CountryService } from './country.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountryEntity } from './country.entity';
import { CountryController } from './country.controller';

@Module({
  imports: [
    CacheModule.register(), // Agregar CacheModule aquí
    TypeOrmModule.forFeature([CountryEntity]),
  ],
  providers: [CountryService],
  controllers: [CountryController],
})
export class CountryModule {}
