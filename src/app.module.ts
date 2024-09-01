import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RestaurantModule } from './restaurant/restaurant.module';
import { GastronomicCultureModule } from './gastronomic-culture/gastronomic-culture.module';

@Module({
  imports: [RestaurantModule, GastronomicCultureModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
