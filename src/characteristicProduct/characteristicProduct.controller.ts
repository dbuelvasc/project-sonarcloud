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
  new UUIDValidationInterceptor("characteristicproductId"),
)
@UseGuards(JwtAuthGuard, RoleGuard)
export class CharacteristicProductController {
  constructor(
    private readonly characteristicproductService: CharacteristicProductService,
  ) {}

  @Get()
  @Roles(UserRoles.ADMIN, UserRoles.FULL_READER)
  async findAll() {
    return await this.characteristicproductService.findAll();
  }

  @Get(":characteristicproductId")
  @Roles(UserRoles.ADMIN, UserRoles.LIMITED_READER)
  async findOne(
    @Param("characteristicproductId") characteristicproductId: string,
  ) {
    return await this.characteristicproductService.findOne(
      characteristicproductId,
    );
  }

  @Post()
  @Roles(UserRoles.ADMIN, UserRoles.WRITER)
  async create(@Body() characteristicproductDto: CharacteristicProductDto) {
    return await this.characteristicproductService.create(
      characteristicproductDto,
    );
  }

  @Put(":characteristicproductId")
  @Roles(UserRoles.ADMIN, UserRoles.WRITER)
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
  @Roles(UserRoles.ADMIN, UserRoles.DELETE)
  @HttpCode(204)
  async delete(
    @Param("characteristicproductId") characteristicproductId: string,
  ) {
    return await this.characteristicproductService.delete(
      characteristicproductId,
    );
  }
}
