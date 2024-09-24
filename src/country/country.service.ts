import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import { Cache } from "cache-manager";
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
  cacheKey = 'countries';

  constructor(
    @InjectRepository(CountryEntity)
    private readonly countryRepository: Repository<CountryEntity>,

    @Inject(CACHE_MANAGER)
       private readonly cacheManager: Cache
  ) {}

  async findAll(): Promise<CountryEntity[]> {
    const cachedCountries: CountryEntity[] | undefined = await this.cacheManager.get<CountryEntity[]>(this.cacheKey);
    if (!cachedCountries) {
      const countries = await this.countryRepository.find({
        relations: ['gastronomicCultures']
      });
      await this.cacheManager.set(this.cacheKey, countries);
      return countries;
    }
    return cachedCountries;
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
    const countryInstance: CountryEntity = plainToInstance(
      CountryEntity,
      countryDto,
    );

    const country: CountryEntity =
      this.countryRepository.create(countryInstance);

    return this.countryRepository.save(country);
  }

  async update(id: string, countryDto: CountryDto): Promise<CountryEntity> {
    const existingCountry = await this.countryRepository.findOne({
      where: { id },
    });

    if (!existingCountry) {
      throw new BusinessLogicException(
        "The country with the given id was not found",
        BusinessError.NOT_FOUND,
      );
    }

    const country: CountryEntity = plainToInstance(CountryEntity, countryDto);

    return this.countryRepository.save({ ...existingCountry, ...country });
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
