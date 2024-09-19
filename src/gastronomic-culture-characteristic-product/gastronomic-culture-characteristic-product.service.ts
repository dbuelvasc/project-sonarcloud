import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { CharacteristicProductEntity } from "../characteristicProduct/characteristicProduct.entity";
import { GastronomicCultureEntity } from "../gastronomicCulture/gastronomicCulture.entity";
import {
  BusinessLogicException,
  BusinessError,
} from "../shared/errors/business-errors";

@Injectable()
export class GastronomicCultureCharacteristicProductService {
  constructor(
    @InjectRepository(GastronomicCultureEntity)
    private readonly gastronomicCultureRepository: Repository<GastronomicCultureEntity>,
    @InjectRepository(CharacteristicProductEntity)
    private readonly characteristicProductRepository: Repository<CharacteristicProductEntity>,
  ) {}

  async addCharacteristicProduct(
    gastronomicCultureId: string,
    characteristicProductId: string,
  ) {
    const gastronomicCulture = await this.gastronomicCultureRepository.findOne({
      where: { id: gastronomicCultureId },
      relations: {
        characteristicProducts: true,
      },
    });
    if (!gastronomicCulture) {
      throw new BusinessLogicException(
        "The gastronomic culture with the given id was not found",
        BusinessError.NOT_FOUND,
      );
    }

    const characteristicProduct =
      await this.characteristicProductRepository.findOne({
        where: { id: characteristicProductId },
      });
    if (!characteristicProduct) {
      throw new BusinessLogicException(
        "The characteristic product with the given id was not found",
        BusinessError.NOT_FOUND,
      );
    }

    gastronomicCulture.characteristicProducts = [
      ...gastronomicCulture.characteristicProducts,
      characteristicProduct,
    ];

    return this.gastronomicCultureRepository.save(gastronomicCulture);
  }
}
