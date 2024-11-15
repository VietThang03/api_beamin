import { Injectable } from '@nestjs/common';
import { CreateSearchDto } from './dto/create-search.dto';
import { UpdateSearchDto } from './dto/update-search.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(private prismaClient: PrismaService) {}

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


  create(createSearchDto: CreateSearchDto) {
    return 'This action adds a new search';
  }

  findAll() {
    return `This action returns all search`;
  }

  findOne(id: number) {
    return `This action returns a #${id} search`;
  }

  update(id: number, updateSearchDto: UpdateSearchDto) {
    return `This action updates a #${id} search`;
  }

  remove(id: number) {
    return `This action removes a #${id} search`;
  }
}
