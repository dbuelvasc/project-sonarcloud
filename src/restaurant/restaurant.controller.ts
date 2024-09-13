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
import { RestaurantService } from './restaurant.service';
import { RestaurantDto } from './restaurant.dto';
import { RestaurantEntity } from './restaurant.entity';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';

@Controller('restaurant')
@UseInterceptors(BusinessErrorsInterceptor)
export class RestaurantController {
    constructor(private readonly restaurantService: RestaurantService) {}

    @Get()
    //@UseGuards(JwtAuthGuard, RoleGuard)
    //@Roles(userRoles.ADMIN, userRoles.FULL_READER)
    async findAll() {
      return await this.restaurantService.findAll();
    }

    @Get(':restaurantId')
    //@UseGuards(JwtAuthGuard, RoleGuard)
    //@Roles(userRoles.ADMIN, userRoles.LIMITED_READER)
    async findOne(@Param('restaurantId') restaurantId: string) {
      return await this.restaurantService.findOne(restaurantId);
    }

    @Post()
    //@UseGuards(JwtAuthGuard, RoleGuard)
    //@Roles(userRoles.ADMIN, userRoles.WRITER)
    async create(@Body() restauranteDto: RestaurantDto) {
      const restaurante: RestaurantEntity = plainToInstance(
        RestaurantEntity,
        restauranteDto,
      );
      return await this.restaurantService.create(restaurante);
    }

    @Put(':restaurantId')
    //@UseGuards(JwtAuthGuard, RoleGuard)
    //@Roles(userRoles.ADMIN, userRoles.WRITER)
    async update(
      @Param('restaurantId') restaurantId: string,
      @Body() restauranteDto: RestaurantDto,
    ) {
      const restaurante: RestaurantEntity = plainToInstance(
        RestaurantEntity,
        restauranteDto,
      );
      return await this.restaurantService.update(restaurantId, restaurante);
    }

    @Delete(':restaurantId')
    //@UseGuards(JwtAuthGuard, RoleGuard)
    //@Roles(userRoles.ADMIN, userRoles.DELETE)
    @HttpCode(204)
    async delete(@Param('restaurantId') restaurantId: string) {
      return await this.restaurantService.delete(restaurantId);
    }
}
