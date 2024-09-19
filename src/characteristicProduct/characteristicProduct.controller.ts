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

import {
  BusinessErrorsInterceptor,
  UUIDValidationInterceptor,
} from "@/shared/interceptors";
import { CharacteristicProductDto } from "./characteristicProduct.dto";
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
  async create(@Body() characteristicproductDto: CharacteristicProductDto) {
    return await this.characteristicproductService.create(
      characteristicproductDto,
    );
  }

  @Put(":characteristicproductId")
  async update(
    @Param("characteristicproductId") characteristicproductId: string,
    @Body() characteristicproductDto: CharacteristicProductDto,
  ) {
    return await this.characteristicproductService.update(
      characteristicproductId,
      characteristicproductDto,
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
