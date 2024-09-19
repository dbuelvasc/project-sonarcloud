import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
  BusinessError,
  BusinessLogicException,
} from "../shared/errors/business-errors";
import { CountryEntity } from "./country.entity";

@Injectable()
export class CountryService {
  constructor(
    @InjectRepository(CountryEntity)
    private readonly countryRepository: Repository<CountryEntity>,
  ) {}

  private isValidUUID(id: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  }

  async findAll(): Promise<CountryEntity[]> {
    return this.countryRepository.find();
  }

  async findOne(id: string): Promise<CountryEntity> {
    // Verificar si el ID es un UUID válido
    if (!this.isValidUUID(id)) {
      throw new BusinessLogicException(
        "The country with the given id was not found",
        BusinessError.NOT_FOUND,
      );
    }
    const country = await this.countryRepository.findOne({ where: { id } });
    if (!country) {
      throw new BusinessLogicException(
        "The country with the given id was not found",
        BusinessError.NOT_FOUND,
      );
    }
    return country;
  }

  async create(country: CountryEntity): Promise<CountryEntity> {
    return this.countryRepository.save(country);
  }

  async update(id: string, country: CountryEntity): Promise<CountryEntity> {
    // Verificar si el ID es un UUID válido
    if (!this.isValidUUID(id)) {
      throw new BusinessLogicException(
        "The country with the given id was not found",
        BusinessError.NOT_FOUND,
      );
    }
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
    // Verificar si el ID es un UUID válido
    if (!this.isValidUUID(id)) {
      throw new BusinessLogicException(
        "The country with the given id was not found",
        BusinessError.NOT_FOUND,
      );
    }
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
