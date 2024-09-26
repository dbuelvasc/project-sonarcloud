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
import { CountryDto } from "./country.dto";
import { CountryService } from "./country.service";

@Controller("countries")
@UseInterceptors(
  BusinessErrorsInterceptor,
  new UUIDValidationInterceptor("countryId"),
)
@UseGuards(JwtAuthGuard, RoleGuard)
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Get()
  @Roles(UserRoles.ADMIN, UserRoles.FULL_READER)
  async findAll() {
    return await this.countryService.findAll();
  }

  @Get(":countryId")
  @Roles(UserRoles.ADMIN, UserRoles.FULL_READER, UserRoles.LIMITED_READER)
  async findOne(@Param("countryId") countryId: string) {
    return await this.countryService.findOne(countryId);
  }

  @Post()
  @Roles(UserRoles.ADMIN, UserRoles.WRITER)
  async create(@Body() countryDto: CountryDto) {
    return await this.countryService.create(countryDto);
  }

  @Put(":countryId")
  @Roles(UserRoles.ADMIN, UserRoles.WRITER)
  async update(
    @Param("countryId") countryId: string,
    @Body() countryDto: CountryDto,
  ) {
    return await this.countryService.update(countryId, countryDto);
  }

  @Delete(":countryId")
  @Roles(UserRoles.ADMIN, UserRoles.DELETE)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param("countryId") countryId: string) {
    return await this.countryService.delete(countryId);
  }
}
