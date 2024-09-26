import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
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
import { GastronomicCultureDto } from "./gastronomicCulture.dto";
import { GastronomicCultureService } from "./gastronomicCulture.service";

@Controller("gastronomic-cultures")
@UseInterceptors(
  BusinessErrorsInterceptor,
  new UUIDValidationInterceptor("gastronomicCultureId"),
)
@UseGuards(JwtAuthGuard, RoleGuard)
export class GastronomicCultureController {
  constructor(
    private readonly gastronomicCultureService: GastronomicCultureService,
  ) {}

  @Get()
  @Roles(UserRoles.ADMIN, UserRoles.FULL_READER)
  async findAll() {
    return this.gastronomicCultureService.findAll();
  }

  @Get(":gastronomicCultureId")
  @Roles(UserRoles.ADMIN, UserRoles.FULL_READER, UserRoles.LIMITED_READER)
  async findOne(@Param("gastronomicCultureId") id: string) {
    return this.gastronomicCultureService.findOne(id);
  }

  @Post()
  @Roles(UserRoles.ADMIN, UserRoles.WRITER)
  async create(@Body() airlineDto: GastronomicCultureDto) {
    return this.gastronomicCultureService.create(airlineDto);
  }

  @Put(":gastronomicCultureId")
  @Roles(UserRoles.ADMIN, UserRoles.WRITER)
  async update(
    @Param("gastronomicCultureId") id: string,
    @Body() gastronomicCultureDto: GastronomicCultureDto,
  ) {
    return this.gastronomicCultureService.update(id, gastronomicCultureDto);
  }

  @Delete(":gastronomicCultureId")
  @Roles(UserRoles.ADMIN, UserRoles.DELETE)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param("gastronomicCultureId") id: string) {
    return this.gastronomicCultureService.delete(id);
  }
}
