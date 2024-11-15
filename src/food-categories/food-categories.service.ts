import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFoodCategoryDto } from './dto/create-food-category.dto';
import { UpdateFoodCategoryDto } from './dto/update-food-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FoodCategoriesService {
  constructor(private prismaClient: PrismaService) {}

  async create(createFoodCategoryDto: CreateFoodCategoryDto) {
    const data = {
      ...createFoodCategoryDto,
    };
    const newFoodCategory = await this.prismaClient.food_categories.create({
      data,
    });
    return {
      message: 'Create new food category successfully!!!',
      data: newFoodCategory,
    };
  }

  async findAll(page: number = 1, limit: number = 10, name?: string) {
    const totalRecords = await this.prismaClient.food_categories.count();
    const totalPages = Math.ceil(totalRecords / limit);
    const defaultLimit = limit ? limit : 10;
    const defaultPage = page ? page : 1;
    
    const categories = await this.prismaClient.food_categories.findMany({
      where: name ? { name: { contains: name,  mode: 'insensitive' }} : {},
      skip: (defaultPage - 1) * limit,
      take: defaultLimit,
    });
    return {
      message: 'Get all food categories successfully!!!',
      meta: {
        current: page,
        pageSize: limit,
        pages: totalPages,
        total: totalRecords,
      },
      data: categories,
    };
  }

  async search(name: string, page: number, limit: number){
    const totalRecords = await this.prismaClient.foods.count();
    const totalPages = Math.ceil(totalRecords / limit);
    const defaultLimit = limit ? limit : 10;
    const defaultPage = page ? page : 1;

    const foods = await this.prismaClient.foods.findMany({
      where: {name: name},
      skip: (defaultPage - 1) * limit,
      take: defaultLimit,
    });

    return {
      message: 'Search successfully!!!',
      meta: {
        current: page,
        pageSize: limit,
        pages: totalPages,
        total: totalRecords,
      },
      data: foods,
    };
  }

  async findOne(id: number) {
    const exsistingFoodCategory =
      await this.prismaClient.food_categories.findUnique({
        where: { id },
      });
    if (!exsistingFoodCategory) {
      throw new NotFoundException(`Food Category with ID ${id} not found`);
    }
    return {
      message: 'Find successfully!',
      data: exsistingFoodCategory,
    };
  }

  async update(id: number, updateFoodCategoryDto: UpdateFoodCategoryDto) {
    await this.findOne(id);
    const data: UpdateFoodCategoryDto = { ...updateFoodCategoryDto };
    const updateFoodCategory = await this.prismaClient.food_categories.update({
      where: { id },
      data,
    });
    return {
      message: 'Update food category successfully!!!',
      data: updateFoodCategory,
    };
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prismaClient.food_categories.delete({
      where: { id },
    });
    return {
      messgae: 'Delete food category successfully!!!',
    };
  }
}
