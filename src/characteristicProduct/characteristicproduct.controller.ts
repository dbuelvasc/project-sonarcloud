import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors,
} from "@nestjs/common";
import { plainToInstance } from "class-transformer";

import {
  BusinessErrorsInterceptor,
  UUIDValidationInterceptor,
} from "@/shared/interceptors";
import { CharacteristicproductDto } from "./characteristicProduct.dto";
import { CharacteristicProductEntity } from "./characteristicProduct.entity";
import { CharacteristicProductService } from "./characteristicProduct.service";

@Controller("characteristicproduct")
@UseInterceptors(
  BusinessErrorsInterceptor,
  new UUIDValidationInterceptor("characteristicproductId"),
)
export class CharacteristicProductController {
  constructor(
    private readonly characteristicproductService: CharacteristicProductService,
  ) {}

  @Get()
  async findAll() {
    return await this.characteristicproductService.findAll();
  }

  @Get(":characteristicproductId")
  async findOne(
    @Param("characteristicproductId") characteristicproductId: string,
  ) {
    return await this.characteristicproductService.findOne(
      characteristicproductId,
    );
  }

  @Post()
  async create(@Body() characteristicproductDto: CharacteristicproductDto) {
    const product: CharacteristicProductEntity = plainToInstance(
      CharacteristicProductEntity,
      characteristicproductDto,
    );
    return await this.characteristicproductService.create(product);
  }

  @Put(":characteristicproductId")
  async update(
    @Param("characteristicproductId") characteristicproductId: string,
    @Body() characteristicproductDto: CharacteristicproductDto,
  ) {
    const product: CharacteristicProductEntity = plainToInstance(
      CharacteristicProductEntity,
      characteristicproductDto,
    );
    return await this.characteristicproductService.update(
      characteristicproductId,
      product,
    );
  }

  @Delete(":characteristicproductId")
  @HttpCode(204)
  async delete(
    @Param("characteristicproductId") characteristicproductId: string,
  ) {
    return await this.characteristicproductService.delete(
      characteristicproductId,
    );
  }
}
