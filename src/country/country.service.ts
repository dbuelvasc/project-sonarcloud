import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToInstance } from "class-transformer";
import { Repository } from "typeorm";

import {
  BusinessError,
  BusinessLogicException,
} from "@/shared/errors/business-errors";
import { CountryDto } from "./country.dto";
import { CountryEntity } from "./country.entity";

@Injectable()
export class CountryService {
  constructor(
    @InjectRepository(CountryEntity)
    private readonly countryRepository: Repository<CountryEntity>,
  ) {}

  async findAll(): Promise<CountryEntity[]> {
    return this.countryRepository.find();
  }

  async findOne(id: string): Promise<CountryEntity> {
    const country = await this.countryRepository.findOne({ where: { id } });
    if (!country) {
      throw new BusinessLogicException(
        "The country with the given id was not found",
        BusinessError.NOT_FOUND,
      );
    }
    return country;
  }

  async create(countryDto: CountryDto): Promise<CountryEntity> {
    const country: CountryEntity = plainToInstance(CountryEntity, countryDto);

    return this.countryRepository.save(country);
  }

  async update(id: string, countryDto: CountryDto): Promise<CountryEntity> {
    const country: CountryEntity = plainToInstance(CountryEntity, countryDto);

    const persistedCountry: CountryEntity =
      await this.countryRepository.findOne({ where: { id } });
    if (!persistedCountry) {
      throw new BusinessLogicException(
        "The country with the given id was not found",
        BusinessError.NOT_FOUND,
      );
    }
    return this.countryRepository.save({ ...persistedCountry, ...country });
  }

  async delete(id: string) {
    const country = await this.countryRepository.findOne({ where: { id } });
    if (!country) {
      throw new BusinessLogicException(
        "The country with the given id was not found",
        BusinessError.NOT_FOUND,
      );
    }
    await this.countryRepository.remove(country);
  }
}
