import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import {
  BusinessError,
  BusinessLogicException,
} from "@/shared/errors/business-errors";
import { GastronomicCultureEntity } from "./gastronomicCulture.entity";
import { GastronomicCultureDto } from "./gastronomicCulture.dto";
import { plainToInstance } from "class-transformer";

@Injectable()
export class GastronomicCultureService {
  constructor(
    @InjectRepository(GastronomicCultureEntity)
    private readonly gastronomicCultureRepository: Repository<GastronomicCultureEntity>,
  ) {}

  async findAll(): Promise<GastronomicCultureEntity[]> {
    return this.gastronomicCultureRepository.find();
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
