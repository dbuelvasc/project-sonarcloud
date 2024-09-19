import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RestaurantService } from "./restaurant.service";
import { RestaurantEntity } from "./restaurant.entity";
import { RestaurantController } from "./restaurant.controller";

@Module({
  imports: [TypeOrmModule.forFeature([RestaurantEntity])],
  providers: [RestaurantService],
  controllers: [RestaurantController],
})
export class RestaurantModule {}
