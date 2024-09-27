import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Cache } from "cache-manager";
import { plainToInstance } from "class-transformer";
import { Repository } from "typeorm";

import { CountryDto } from "@/country/country.dto";
import { CountryEntity } from "@/country/country.entity";
import { GastronomicCultureDto } from "@/gastronomicCulture/gastronomicCulture.dto";
import { GastronomicCultureEntity } from "@/gastronomicCulture/gastronomicCulture.entity";
import {
  BusinessError,
  BusinessLogicException,
} from "@/shared/errors/business-errors";

@Injectable()
export class GastronomicCultureCountryService {
  baseCacheKey = "gastronomicCulture-characteristicProduct";

  constructor(
    @InjectRepository(GastronomicCultureEntity)
    private readonly gastronomicCultureRepository: Repository<GastronomicCultureEntity>,
    @InjectRepository(CountryEntity)
    private readonly countryRepository: Repository<CountryEntity>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async addCountryToGastronomicCulture(
    gastronomicCultureId: string,
    countryId: string,
  ) {
    const gastronomicCulture = await this.gastronomicCultureRepository.findOne({
      where: { id: gastronomicCultureId },
      relations: {
        countries: true,
      },
    });
    if (!gastronomicCulture) {
      throw new BusinessLogicException(
        "The gastronomic culture with the given id was not found",
        BusinessError.NOT_FOUND,
      );
    }

    const characteristicProduct = await this.countryRepository.findOne({
      where: { id: countryId },
    });
    if (!characteristicProduct) {
      throw new BusinessLogicException(
        "The characteristic product with the given id was not found",
        BusinessError.NOT_FOUND,
      );
    }

    gastronomicCulture.countries = [
      ...gastronomicCulture.countries,
      characteristicProduct,
    ];

    return this.gastronomicCultureRepository.save(gastronomicCulture);
  }

  async findCountriesFromGastronomicCulture(gastronomicCultureId: string) {
    const cacheKey = `${this.baseCacheKey}-country-${gastronomicCultureId}`;
    const cachedCountries =
      await this.cacheManager.get<CountryEntity[]>(cacheKey);

    if (cachedCountries) {
      return cachedCountries;
    }

    const gastronomicCulture = await this.gastronomicCultureRepository.findOne({
      where: { id: gastronomicCultureId },
      relations: {
        countries: true,
      },
    });

    if (!gastronomicCulture) {
      throw new BusinessLogicException(
        "The gastronomic culture with the given id was not found",
        BusinessError.NOT_FOUND,
      );
    }

    await this.cacheManager.set(cacheKey, gastronomicCulture.countries);

    return gastronomicCulture.countries;
  }

  async findCountryFromGastronomicCulture(
    gastronomicCultureId: string,
    countryId: string,
  ) {
    const characteristicProduct = await this.countryRepository.findOne({
      where: { id: countryId },
    });

    if (!characteristicProduct)
      throw new BusinessLogicException(
        "The characteristic product with the given id was not found",
        BusinessError.NOT_FOUND,
      );

    const gastronomicCulture = await this.gastronomicCultureRepository.findOne({
      where: { id: gastronomicCultureId },
      relations: {
        countries: true,
      },
    });
    if (!gastronomicCulture)
      throw new BusinessLogicException(
        "The gastronomic culture with the given id was not found",
        BusinessError.NOT_FOUND,
      );

    const characteristicProductInGastronomicCulture =
      gastronomicCulture.countries.find((c) => c.id === countryId);
    if (!characteristicProductInGastronomicCulture)
      throw new BusinessLogicException(
        "The characteristic product does not belong to the given gastronomic culture",
        BusinessError.NOT_FOUND,
      );

    return characteristicProductInGastronomicCulture;
  }

  async associateCountryToGastronomicCulture(
    gastronomicCultureId: string,
    countriesDto: CountryDto[],
  ) {
    const gastronomicCulture = await this.gastronomicCultureRepository.findOne({
      where: { id: gastronomicCultureId },
      relations: {
        countries: true,
      },
    });

    if (!gastronomicCulture)
      throw new BusinessLogicException(
        "The gastronomic culture with the given id was not found",
        BusinessError.NOT_FOUND,
      );

    const countriesInstance = plainToInstance(CountryEntity, countriesDto);

    await Promise.all(
      countriesInstance.map(async (characteristicProductInstance) => {
        const existingCharacteristicProduct =
          await this.countryRepository.findOne({
            where: { id: characteristicProductInstance.id },
          });

        if (!existingCharacteristicProduct)
          throw new BusinessLogicException(
            "The characteristic product with the given id was not found",
            BusinessError.NOT_FOUND,
          );

        return characteristicProductInstance;
      }),
    );

    gastronomicCulture.countries = countriesInstance;
    return await this.gastronomicCultureRepository.save(gastronomicCulture);
  }

  async deleteCountryFromGastronomicCulture(
    gastronomicCultureId: string,
    countryId: string,
  ) {
    const characteristicProduct = await this.countryRepository.findOne({
      where: { id: countryId },
    });
    if (!characteristicProduct)
      throw new BusinessLogicException(
        "The characteristic product with the given id was not found",
        BusinessError.NOT_FOUND,
      );

    const gastronomicCulture = await this.gastronomicCultureRepository.findOne({
      where: { id: gastronomicCultureId },
      relations: {
        countries: true,
      },
    });

    if (!gastronomicCulture)
      throw new BusinessLogicException(
        "The gastronomic culture with the given id was not found",
        BusinessError.NOT_FOUND,
      );

    const characteristicProductInGastronomicCulture =
      gastronomicCulture.countries.find(
        (c) => c.id === characteristicProduct.id,
      );

    if (!characteristicProductInGastronomicCulture) {
      throw new BusinessLogicException(
        "The characteristic product with the given id is not associated with the given gastronomic culture",
        BusinessError.PRECONDITION_FAILED,
      );
    }

    gastronomicCulture.countries = gastronomicCulture.countries.filter(
      (c) => c.id !== countryId,
    );

    await this.gastronomicCultureRepository.save(gastronomicCulture);
  }

  async addGastronomicCultureToCountry(
    countryId: string,
    gastronomicCultureId: string,
  ) {
    const country = await this.countryRepository.findOne({
      where: { id: countryId },
      relations: {
        gastronomicCultures: true,
      },
    });
    if (!country) {
      throw new BusinessLogicException(
        "The country with the given id was not found",
        BusinessError.NOT_FOUND,
      );
    }

    const gastronomicCulture = await this.gastronomicCultureRepository.findOne({
      where: { id: gastronomicCultureId },
    });
    if (!gastronomicCulture) {
      throw new BusinessLogicException(
        "The gastronomic culture with the given id was not found",
        BusinessError.NOT_FOUND,
      );
    }

    country.gastronomicCultures = [
      ...country.gastronomicCultures,
      gastronomicCulture,
    ];

    return this.countryRepository.save(country);
  }
  async findGastronomicCulturesFromCountry(countryId: string) {
    const cacheKey = `${this.baseCacheKey}-country-${countryId}`;
    const cachedGastronomicCultures =
      await this.cacheManager.get<GastronomicCultureEntity[]>(cacheKey);

    if (cachedGastronomicCultures) {
      return cachedGastronomicCultures;
    }

    const country = await this.countryRepository.findOne({
      where: { id: countryId },
      relations: {
        gastronomicCultures: true,
      },
    });

    if (!country) {
      throw new BusinessLogicException(
        "The country with the given id was not found",
        BusinessError.NOT_FOUND,
      );
    }

    const gastronomicCultures = country.gastronomicCultures;
    await this.cacheManager.set(cacheKey, gastronomicCultures);

    return gastronomicCultures;
  }

  async findGastronomicCultureFromCountry(
    countryId: string,
    gastronomicCultureId: string,
  ) {
    const gastronomicCulture = await this.gastronomicCultureRepository.findOne({
      where: { id: gastronomicCultureId },
    });

    if (!gastronomicCulture)
      throw new BusinessLogicException(
        "The gastronomic culture with the given id was not found",
        BusinessError.NOT_FOUND,
      );

    const country = await this.countryRepository.findOne({
      where: { id: countryId },
      relations: {
        gastronomicCultures: true,
      },
    });
    if (!country)
      throw new BusinessLogicException(
        "The country with the given id was not found",
        BusinessError.NOT_FOUND,
      );

    const gastronomicCultureInCountry = country.gastronomicCultures.find(
      (gc) => gc.id === gastronomicCultureId,
    );
    if (!gastronomicCultureInCountry)
      throw new BusinessLogicException(
        "The gastronomic culture does not belong to the given country",
        BusinessError.NOT_FOUND,
      );

    return gastronomicCultureInCountry;
  }

  async associateGastronomicCulturesToCountry(
    countryId: string,
    gastronomicCulturesDto: GastronomicCultureDto[],
  ) {
    const country = await this.countryRepository.findOne({
      where: { id: countryId },
      relations: {
        gastronomicCultures: true,
      },
    });

    if (!country)
      throw new BusinessLogicException(
        "The country with the given id was not found",
        BusinessError.NOT_FOUND,
      );

    const gastronomicCulturesInstance = plainToInstance(
      GastronomicCultureEntity,
      gastronomicCulturesDto,
    );

    await Promise.all(
      gastronomicCulturesInstance.map(async (gastronomicCultureInstance) => {
        const existingGastronomicCulture =
          await this.gastronomicCultureRepository.findOne({
            where: { id: gastronomicCultureInstance.id },
          });

        if (!existingGastronomicCulture)
          throw new BusinessLogicException(
            "The gastronomic culture with the given id was not found",
            BusinessError.NOT_FOUND,
          );

        return gastronomicCultureInstance;
      }),
    );

    country.gastronomicCultures = gastronomicCulturesInstance;
    return await this.countryRepository.save(country);
  }

  async deleteGastronomicCultureFromCountry(
    countryId: string,
    gastronomicCultureId: string,
  ) {
    const country = await this.countryRepository.findOne({
      where: { id: countryId },
      relations: {
        gastronomicCultures: true,
      },
    });

    if (!country)
      throw new BusinessLogicException(
        "The country with the given id was not found",
        BusinessError.NOT_FOUND,
      );

    const gastronomicCulture = await this.gastronomicCultureRepository.findOne({
      where: { id: gastronomicCultureId },
    });

    if (!gastronomicCulture) {
      throw new BusinessLogicException(
        "The gastronomic culture with the given id was not found",
        BusinessError.NOT_FOUND,
      );
    }

    const gastronomicCultureInCountry = country.gastronomicCultures.find(
      (gc) => gc.id === gastronomicCultureId,
    );

    if (!gastronomicCultureInCountry) {
      throw new BusinessLogicException(
        "The gastronomic culture with the given id is not associated with the given country",
        BusinessError.PRECONDITION_FAILED,
      );
    }

    country.gastronomicCultures = country.gastronomicCultures.filter(
      (gc) => gc.id !== gastronomicCultureId,
    );

    await this.countryRepository.save(country);
  }
}
