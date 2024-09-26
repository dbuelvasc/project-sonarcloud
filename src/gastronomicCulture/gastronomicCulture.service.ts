import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Cache } from "cache-manager";
import { plainToInstance } from "class-transformer";
import { Repository } from "typeorm";

import {
  BusinessError,
  BusinessLogicException,
} from "@/shared/errors/business-errors";
import { GastronomicCultureDto } from "./gastronomicCulture.dto";
import { GastronomicCultureEntity } from "./gastronomicCulture.entity";

@Injectable()
export class GastronomicCultureService {
  cacheKey = "gastronomic-cultures";

  constructor(
    @InjectRepository(GastronomicCultureEntity)
    private readonly gastronomicCultureRepository: Repository<GastronomicCultureEntity>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async findAll(): Promise<GastronomicCultureEntity[]> {
    const cachedGastronomicCultures = await this.cacheManager.get<
      GastronomicCultureEntity[] | undefined
    >(this.cacheKey);

    if (cachedGastronomicCultures) {
      return cachedGastronomicCultures;
    }

    const gastronomicCultures = await this.gastronomicCultureRepository.find();

    await this.cacheManager.set(this.cacheKey, gastronomicCultures);

    return gastronomicCultures;
  }

  async findOne(id: string): Promise<GastronomicCultureEntity> {
    const gastronomicCulture = await this.gastronomicCultureRepository.findOne({
      where: { id },
    });
    if (!gastronomicCulture) {
      throw new BusinessLogicException(
        "The gastronomic culture with the given id was not found",
        BusinessError.NOT_FOUND,
      );
    }
    return gastronomicCulture;
  }

  async create(
    gastronomicCultureDto: GastronomicCultureDto,
  ): Promise<GastronomicCultureEntity> {
    const gastronomicCultureInstance = plainToInstance(
      GastronomicCultureEntity,
      gastronomicCultureDto,
    );

    const gastronomicCulture = this.gastronomicCultureRepository.create(
      gastronomicCultureInstance,
    );

    return this.gastronomicCultureRepository.save(gastronomicCulture);
  }

  async update(
    id: string,
    gastronomicCultureDto: GastronomicCultureDto,
  ): Promise<GastronomicCultureEntity> {
    const persistedGastronomicCulture =
      await this.gastronomicCultureRepository.findOne({ where: { id } });
    if (!persistedGastronomicCulture) {
      throw new BusinessLogicException(
        "The gastronomic culture with the given id was not found",
        BusinessError.NOT_FOUND,
      );
    }

    const gastronomicCultureInstance = plainToInstance(
      GastronomicCultureEntity,
      gastronomicCultureDto,
    );

    return this.gastronomicCultureRepository.save({
      ...persistedGastronomicCulture,
      ...gastronomicCultureInstance,
    });
  }

  async delete(id: string) {
    const gastronomicCulture = await this.gastronomicCultureRepository.findOne({
      where: { id },
    });
    if (!gastronomicCulture) {
      throw new BusinessLogicException(
        "The gastronomic culture with the given id was not found",
        BusinessError.NOT_FOUND,
      );
    }
    await this.gastronomicCultureRepository.remove(gastronomicCulture);
  }
}
