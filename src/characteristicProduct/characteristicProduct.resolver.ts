import { Query, Resolver } from "@nestjs/graphql";
import { CharacteristicProductService } from "./characteristicProduct.service";
import { CharacteristicProductEntity } from "./characteristicProduct.entity";

@Resolver()
export class CharacteristicProductResolver {
  constructor(private readonly service: CharacteristicProductService) {}

  @Query(() => [CharacteristicProductEntity])
  async characteristicProducts() {
    return this.service.findAll();
  }
}
