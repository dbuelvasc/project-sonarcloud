import { Module } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipeEntity } from './recipe.entity/recipe.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RecipeEntity])],
  providers: [RecipeService],
})
export class RecipeModule {}
