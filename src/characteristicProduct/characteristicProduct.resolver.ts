import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { plainToInstance } from "class-transformer";

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
    @Args("categoriaProducto")
    CharacteristicProductDto: CharacteristicProductDto,
  ): Promise<CharacteristicProductEntity> {
    const categoriaProducto = plainToInstance(
      CharacteristicProductEntity,
      CharacteristicProductDto,
    );
    return this.service.create(categoriaProducto);
  }

  @Mutation(() => CharacteristicProductEntity)
  updateCharacteristicProduct(
    @Args("id") id: string,
    @Args("categoriaProducto")
    CharacteristicProductDto: CharacteristicProductDto,
  ): Promise<CharacteristicProductEntity> {
    const categoriaProducto = plainToInstance(
      CharacteristicProductEntity,
      CharacteristicProductDto,
    );
    return this.service.update(id, categoriaProducto);
  }

  @Mutation(() => String)
  deletecharacteristicProduct(@Args("id") id: string) {
    this.service.delete(id);
    return id;
  }
}
