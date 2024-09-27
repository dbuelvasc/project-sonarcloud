import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";

import { CharacteristicProductDto } from "./characteristicProduct.dto";
import { CharacteristicProductEntity } from "./characteristicProduct.entity";
import { CharacteristicProductService } from "./characteristicProduct.service";

@Resolver()
export class CharacteristicProductResolver {
  constructor(private readonly service: CharacteristicProductService) {}

  @Query(() => [CharacteristicProductEntity])
  async characteristicProducts() {
    return this.service.findAll();
  }

  @Query(() => CharacteristicProductEntity)
  async characteristicProduct(
    @Args("id") id: string,
  ): Promise<CharacteristicProductEntity> {
    return this.service.findOne(id);
  }

  @Mutation(() => CharacteristicProductEntity)
  createCharacteristicProduct(
    @Args("characteristicProduct")
    characteristicProductDto: CharacteristicProductDto,
  ): Promise<CharacteristicProductEntity> {
    return this.service.create(characteristicProductDto);
  }

  @Mutation(() => CharacteristicProductEntity)
  updateCharacteristicProduct(
    @Args("id") id: string,
    @Args("characteristicProduct")
    characteristicProductDto: CharacteristicProductDto,
  ): Promise<CharacteristicProductEntity> {
    return this.service.update(id, characteristicProductDto);
  }

  @Mutation(() => String)
  deleteCharacteristicProduct(@Args("id") id: string) {
    this.service.delete(id);
    return id;
  }
}
