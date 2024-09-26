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
import { RestaurantDto } from "./restaurant.dto";
import { RestaurantService } from "./restaurant.service";

@Controller("restaurants")
@UseInterceptors(
  BusinessErrorsInterceptor,
  new UUIDValidationInterceptor("restaurantId"),
)
@UseGuards(JwtAuthGuard, RoleGuard)
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Get()
  @Roles(UserRoles.ADMIN, UserRoles.FULL_READER)
  async findAll() {
    return await this.restaurantService.findAll();
  }

  @Get(":restaurantId")
  @Roles(UserRoles.ADMIN, UserRoles.FULL_READER, UserRoles.LIMITED_READER)
  async findOne(@Param("restaurantId") restaurantId: string) {
    return await this.restaurantService.findOne(restaurantId);
  }

  @Post()
  @Roles(UserRoles.ADMIN, UserRoles.WRITER)
  async create(@Body() restaurantDto: RestaurantDto) {
    return await this.restaurantService.create(restaurantDto);
  }

  @Put(":restaurantId")
  @Roles(UserRoles.ADMIN, UserRoles.WRITER)
  async update(
    @Param("restaurantId") restaurantId: string,
    @Body() restaurantDto: RestaurantDto,
  ) {
    return await this.restaurantService.update(restaurantId, restaurantDto);
  }

  @Delete(":restaurantId")
  @Roles(UserRoles.ADMIN, UserRoles.DELETE)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param("restaurantId") restaurantId: string) {
    return await this.restaurantService.delete(restaurantId);
  }
}
