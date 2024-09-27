import { ApolloDriver } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { TypeOrmModule } from "@nestjs/typeorm";
import { join } from "path";

import { AuthModule } from "@/auth/auth.module";
import { CharacteristicProductModule } from "@/characteristicProduct/characteristicProduct.module";
import { CountryRestaurantModule } from "@/country-restaurant/country-restaurant.module";
import { CountryModule } from "@/country/country.module";
import { GastronomicCultureCharacteristicProductModule } from "@/gastronomicCulture-characteristicProduct/gastronomicCulture-characteristicProduct.module";
import { GastronomicCultureCountryModule } from "@/gastronomicCulture-country/gastronomicCulture-country.module";
import { GastronomicCultureRecipeModule } from "@/gastronomicCulture-recipe/gastronomicCulture-recipe.module";
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
      dropSchema: process.env.NODE_ENV === "development",
      host: process.env.DB_HOST,
      keepConnectionAlive: true,
      password: process.env.DB_PASSWORD,
      port: Number(process.env.DB_PORT),
      synchronize: true,
      type: "postgres",
      username: process.env.DB_USER,
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), "src/schema.gql"),
      driver: ApolloDriver,
    }),
    AuthModule,
    CharacteristicProductModule,
    CountryModule,
    CountryRestaurantModule,
    GastronomicCultureCharacteristicProductModule,
    GastronomicCultureCountryModule,
    GastronomicCultureModule,
    GastronomicCultureRecipeModule,
    RecipeModule,
    RestaurantModule,
    UserModule,
  ],
})
export class AppModule {}
