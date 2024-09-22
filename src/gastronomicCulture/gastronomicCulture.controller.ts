import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from "@nestjs/common";

import {
  BusinessErrorsInterceptor,
  UUIDValidationInterceptor,
} from "@/shared/interceptors";
import { GastronomicCultureDto } from "./gastronomicCulture.dto";
import { GastronomicCultureService } from "./gastronomicCulture.service";

@Controller("gastronomic-cultures")
@UseInterceptors(
  BusinessErrorsInterceptor,
  new UUIDValidationInterceptor("gastronomicCultureId"),
)
export class GastronomicCultureController {
  constructor(
    private readonly gastronomicCultureService: GastronomicCultureService,
  ) {}

  @Get()
  async findAll() {
    return this.gastronomicCultureService.findAll();
  }

  @Get(":gastronomicCultureId")
  async findOne(@Param("gastronomicCultureId") id: string) {
    return this.gastronomicCultureService.findOne(id);
  }

  @Post()
  async create(@Body() airlineDto: GastronomicCultureDto) {
    return this.gastronomicCultureService.create(airlineDto);
  }

  @Patch(":gastronomicCultureId")
  async update(
    @Param("gastronomicCultureId") id: string,
    @Body() gastronomicCultureDto: GastronomicCultureDto,
  ) {
    return this.gastronomicCultureService.update(id, gastronomicCultureDto);
  }

  @Delete(":gastronomicCultureId")
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param("gastronomicCultureId") id: string) {
    return this.gastronomicCultureService.delete(id);
  }
}
