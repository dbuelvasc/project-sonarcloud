import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Cache } from "cache-manager";
import { plainToInstance } from "class-transformer";
import { Repository } from "typeorm";

import { CharacteristicProductDto } from "@/characteristicProduct/characteristicProduct.dto";
import { CharacteristicProductEntity } from "@/characteristicProduct/characteristicProduct.entity";
import { GastronomicCultureEntity } from "@/gastronomicCulture/gastronomicCulture.entity";
import {
  BusinessError,
  BusinessLogicException,
} from "@/shared/errors/business-errors";

@Injectable()
export class GastronomicCultureCharacteristicProductService {
  baseCacheKey = "gastronomicCulture-characteristicProduct";

  constructor(
    @InjectRepository(GastronomicCultureEntity)
    private readonly gastronomicCultureRepository: Repository<GastronomicCultureEntity>,
    @InjectRepository(CharacteristicProductEntity)
    private readonly characteristicProductRepository: Repository<CharacteristicProductEntity>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async addCharacteristicProductToGastronomicCulture(
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

  async findCharacteristicProductsFromGastronomicCulture(
    gastronomicCultureId: string,
  ) {
    const cacheKey = `${this.baseCacheKey}-${gastronomicCultureId}`;

    const cachedCharacteristicProducts =
      await this.cacheManager.get<CharacteristicProductEntity[]>(cacheKey);

    if (cachedCharacteristicProducts) {
      return cachedCharacteristicProducts;
    }

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

    await this.cacheManager.set(
      cacheKey,
      gastronomicCulture.characteristicProducts,
    );

    return gastronomicCulture.characteristicProducts;
  }

  async findCharacteristicProductFromGastronomicCulture(
    gastronomicCultureId: string,
    characteristicProductId: string,
  ) {
    const characteristicProduct =
      await this.characteristicProductRepository.findOne({
        where: { id: characteristicProductId },
      });

    if (!characteristicProduct)
      throw new BusinessLogicException(
        "The characteristic product with the given id was not found",
        BusinessError.NOT_FOUND,
      );

    const gastronomicCulture = await this.gastronomicCultureRepository.findOne({
      where: { id: gastronomicCultureId },
      relations: {
        characteristicProducts: true,
      },
    });
    if (!gastronomicCulture)
      throw new BusinessLogicException(
        "The gastronomic culture with the given id was not found",
        BusinessError.NOT_FOUND,
      );

    const characteristicProductInGastronomicCulture =
      gastronomicCulture.characteristicProducts.find(
        (c) => c.id === characteristicProductId,
      );
    if (!characteristicProductInGastronomicCulture)
      throw new BusinessLogicException(
        "The characteristic product does not belong to the given gastronomic culture",
        BusinessError.NOT_FOUND,
      );

    return characteristicProductInGastronomicCulture;
  }

  async associateCharacteristicProductsToGastronomicCulture(
    gastronomicCultureId: string,
    characteristicProductsDto: CharacteristicProductDto[],
  ) {
    const gastronomicCulture = await this.gastronomicCultureRepository.findOne({
      where: { id: gastronomicCultureId },
      relations: {
        characteristicProducts: true,
      },
    });

    if (!gastronomicCulture)
      throw new BusinessLogicException(
        "The gastronomic culture with the given id was not found",
        BusinessError.NOT_FOUND,
      );

    const characteristicProductsInstance = plainToInstance(
      CharacteristicProductEntity,
      characteristicProductsDto,
    );

    await Promise.all(
      characteristicProductsInstance.map(
        async (characteristicProductInstance) => {
          const existingCharacteristicProduct =
            await this.characteristicProductRepository.findOne({
              where: { id: characteristicProductInstance.id },
            });

          if (!existingCharacteristicProduct)
            throw new BusinessLogicException(
              "The characteristic product with the given id was not found",
              BusinessError.NOT_FOUND,
            );

          return characteristicProductInstance;
        },
      ),
    );

    gastronomicCulture.characteristicProducts = characteristicProductsInstance;
    return await this.gastronomicCultureRepository.save(gastronomicCulture);
  }

  async deleteCharacteristicProductFromGastronomicCulture(
    gastronomicCultureId: string,
    characteristicProductId: string,
  ) {
    const characteristicProduct =
      await this.characteristicProductRepository.findOne({
        where: { id: characteristicProductId },
      });
    if (!characteristicProduct)
      throw new BusinessLogicException(
        "The characteristic product with the given id was not found",
        BusinessError.NOT_FOUND,
      );

    const gastronomicCulture = await this.gastronomicCultureRepository.findOne({
      where: { id: gastronomicCultureId },
      relations: {
        characteristicProducts: true,
      },
    });

    if (!gastronomicCulture)
      throw new BusinessLogicException(
        "The gastronomic culture with the given id was not found",
        BusinessError.NOT_FOUND,
      );

    const characteristicProductInGastronomicCulture =
      gastronomicCulture.characteristicProducts.find(
        (c) => c.id === characteristicProduct.id,
      );

    if (!characteristicProductInGastronomicCulture) {
      throw new BusinessLogicException(
        "The characteristic product with the given id is not associated with the given gastronomic culture",
        BusinessError.PRECONDITION_FAILED,
      );
    }

    gastronomicCulture.characteristicProducts =
      gastronomicCulture.characteristicProducts.filter(
        (c) => c.id !== characteristicProductId,
      );

    await this.gastronomicCultureRepository.save(gastronomicCulture);
  }
}
