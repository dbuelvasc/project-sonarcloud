import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CharacteristicProductModule } from "@/characteristicProduct/characteristicProduct.module";
import { CountryRestaurantModule } from "@/country-restaurant/country-restaurant.module";
import { CountryModule } from "@/country/country.module";
import { GastronomicCultureModule } from "@/gastronomicCulture/gastronomicCulture.module";
import { RecipeModule } from "@/recipe/recipe.module";
import { RestaurantModule } from "@/restaurant/restaurant.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      autoLoadEntities: true,
      database: process.env.DB_NAME,
      dropSchema: true,
      host: process.env.DB_HOST,
      keepConnectionAlive: true,
      password: process.env.DB_PASSWORD,
      port: Number(process.env.DB_PORT),
      synchronize: true,
      type: "postgres",
      username: process.env.DB_USER,
    }),
    CharacteristicProductModule,
    CountryModule,
    CountryRestaurantModule,
    GastronomicCultureModule,
    RecipeModule,
    RestaurantModule,
  ],
})
export class AppModule {}
