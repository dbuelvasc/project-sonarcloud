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
import { UserRoles } from "@/shared/security/UserRoles";
import { CountryDto } from "./country.dto";
import { CountryService } from "./country.service";

@Controller("country")
@UseInterceptors(
  BusinessErrorsInterceptor,
  new UUIDValidationInterceptor("countryId"),
)
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRoles.ADMIN, UserRoles.FULL_READER)
  async findAll() {
    return await this.countryService.findAll();
  }

  @Get(":countryId")
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRoles.ADMIN, UserRoles.LIMITED_READER)
  async findOne(@Param("countryId") countryId: string) {
    return await this.countryService.findOne(countryId);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRoles.ADMIN, UserRoles.WRITER)
  async create(@Body() countryDto: CountryDto) {
    return await this.countryService.create(countryDto);
  }

  @Put(":countryId")
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRoles.ADMIN, UserRoles.WRITER)
  async update(
    @Param("countryId") countryId: string,
    @Body() countryDto: CountryDto,
  ) {
    return await this.countryService.update(countryId, countryDto);
  }

  @Delete(":countryId")
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRoles.ADMIN, UserRoles.DELETE)
  @HttpCode(204)
  async delete(@Param("countryId") countryId: string) {
    return await this.countryService.delete(countryId);
  }
}
