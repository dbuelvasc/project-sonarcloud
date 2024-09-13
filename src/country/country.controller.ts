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
    UseGuards,
  } from '@nestjs/common';
import { CountryService } from './country.service';
import { CountryDto } from './country.dto';
import { CountryEntity } from './country.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';

@Controller('country')
@UseInterceptors(BusinessErrorsInterceptor)
export class CountryController {
    constructor(private readonly countryService: CountryService) {}

    @Get()
    //@UseGuards(JwtAuthGuard, RoleGuard)
    //@Roles(userRoles.ADMIN, userRoles.FULL_READER)
    async findAll() {
        return await this.countryService.findAll();
    }

    @Get(':countryId')
    //@UseGuards(JwtAuthGuard, RoleGuard)
    //@Roles(userRoles.ADMIN, userRoles.LIMITED_READER)
    async findOne(@Param('countryId') countryId: string) {
        return await this.countryService.findOne(countryId);
    }

    @Post()
    //@UseGuards(JwtAuthGuard, RoleGuard)
    //@Roles(userRoles.ADMIN, userRoles.WRITER)
    async create(@Body() paisDto: CountryDto) {
        const country: CountryEntity = plainToInstance(CountryEntity, CountryDto);
        return await this.countryService.create(country);
    }

    @Put(':countryId')
    //@UseGuards(JwtAuthGuard, RoleGuard)
    //@Roles(userRoles.ADMIN, userRoles.WRITER)
    async update(@Param('countryId') countryId: string, @Body() countryDto: CountryDto) {
        const country: CountryEntity = plainToInstance(CountryEntity, countryDto);
        return await this.countryService.update(countryId, country);
    }

    @Delete(':countryId')
    //@UseGuards(JwtAuthGuard, RoleGuard)
    //@Roles(userRoles.ADMIN, userRoles.DELETE)
    @HttpCode(204)
    async delete(@Param('countryId') countryId: string) {
        return await this.countryService.delete(countryId);
    }
}
