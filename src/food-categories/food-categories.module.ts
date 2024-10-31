import { Module } from '@nestjs/common';
import { FoodCategoriesService } from './food-categories.service';
import { FoodCategoriesController } from './food-categories.controller';

@Module({
  controllers: [FoodCategoriesController],
  providers: [FoodCategoriesService],
  exports: [FoodCategoriesService]
})
export class FoodCategoriesModule {}
