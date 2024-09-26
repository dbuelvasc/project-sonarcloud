import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthModule } from "@/auth/auth.module";
import { CharacteristicProductModule } from "@/characteristicProduct/characteristicProduct.module";
import { CountryRestaurantModule } from "@/country-restaurant/country-restaurant.module";
import { CountryModule } from "@/country/country.module";
import { GastronomicCultureCharacteristicProductModule } from "@/gastronomicCulture-characteristicProduct/gastronomicCulture-characteristicProduct.module";
import { GastronomicCultureModule } from "@/gastronomicCulture/gastronomicCulture.module";
import { RecipeModule } from "@/recipe/recipe.module";
import { RestaurantModule } from "@/restaurant/restaurant.module";
import { UserModule } from "@/user/user.module";

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
    AuthModule,
    CharacteristicProductModule,
    CountryModule,
    CountryRestaurantModule,
    GastronomicCultureCharacteristicProductModule,
    GastronomicCultureModule,
    RecipeModule,
    RestaurantModule,
    UserModule,
  ],
})
export class AppModule {}
