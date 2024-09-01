import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RestaurantModule } from './restaurant/restaurant.module';
import { GastronomicCultureModule } from './gastronomic-culture/gastronomic-culture.module';
import { CharacteristicproductModule } from './characteristicproduct/characteristicproduct.module';

@Module({
  imports: [RestaurantModule, GastronomicCultureModule, CharacteristicproductModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
