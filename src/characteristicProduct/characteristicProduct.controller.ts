import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";

import { JwtAuthGuard } from "@/auth/guards";
import { RoleGuard } from "@/auth/roles/role.guard";
import { Roles } from "@/auth/roles/roles.decorator";
import {
  BusinessErrorsInterceptor,
  UUIDValidationInterceptor,
} from "@/shared/interceptors";
import { UserRoles } from "@/shared/security/userRoles";
import { CharacteristicProductDto } from "./characteristicProduct.dto";
import { CharacteristicProductService } from "./characteristicProduct.service";

@Controller("products")
@UseInterceptors(
  BusinessErrorsInterceptor,
  new UUIDValidationInterceptor("characteristicProductId"),
)
@UseGuards(JwtAuthGuard, RoleGuard)
export class CharacteristicProductController {
  constructor(
    private readonly characteristicProductService: CharacteristicProductService,
  ) {}

  @Get()
  @Roles(UserRoles.ADMIN, UserRoles.FULL_READER)
  async findAll() {
    return await this.characteristicProductService.findAll();
  }

  @Get(":characteristicProductId")
  @Roles(UserRoles.ADMIN, UserRoles.LIMITED_READER)
  async findOne(
    @Param("characteristicProductId") characteristicProductId: string,
  ) {
    return await this.characteristicProductService.findOne(
      characteristicProductId,
    );
  }

  @Post()
  @Roles(UserRoles.ADMIN, UserRoles.WRITER)
  async create(@Body() characteristicProductDto: CharacteristicProductDto) {
    return await this.characteristicProductService.create(
      characteristicProductDto,
    );
  }

  @Put(":characteristicProductId")
  @Roles(UserRoles.ADMIN, UserRoles.WRITER)
  async update(
    @Param("characteristicProductId") characteristicProductId: string,
    @Body() characteristicProductDto: CharacteristicProductDto,
  ) {
    return await this.characteristicProductService.update(
      characteristicProductId,
      characteristicProductDto,
    );
  }

  @Delete(":characteristicProductId")
  @Roles(UserRoles.ADMIN, UserRoles.DELETE)
  @HttpCode(204)
  async delete(
    @Param("characteristicProductId") characteristicProductId: string,
  ) {
    return await this.characteristicProductService.delete(
      characteristicProductId,
    );
  }
}
