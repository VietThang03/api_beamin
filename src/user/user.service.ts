import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { compareSync, genSaltSync, hashSync, hash } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prismaClient: PrismaService) {}

  hashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  };

  async create(createUserDto: CreateUserDto) {
    const isExist = await this.prismaClient.users.findUnique({
      where: { email: createUserDto.email },
    });
    if (isExist) {
      throw new BadRequestException(
        `Email ${createUserDto.email} already existed!!!`,
      );
    }
    const hashPassword = this.hashPassword(createUserDto.password)
    const newUser = await this.prismaClient.users.create({
      data:{
        ...createUserDto,
        password: hashPassword
      }
    })
    return {
      message: 'Create new user successfully',
      data: newUser
    };
  }

  async findAll(page: number, limit: number, name: string) {
    const totalRecords = await this.prismaClient.users.count();
    const totalPages = Math.ceil(totalRecords / limit);
    const defaultLimit = limit ? limit : 20;
    const defaultPage = page ? page : 1;
    
    const users = await this.prismaClient.users.findMany({
      where: name ? { username: { contains: name,  mode: 'insensitive' }} : {},
      skip: (defaultPage - 1) * limit,
      take: defaultLimit
    });
    return {
      message: 'Get all users successfully!!!',
      meta: {
        current: page,
        pageSize: limit,
        pages: totalPages,
        total: totalRecords,
      },
      data: users,
    };
  }

  async findOne(id: number) {
    const user = await this.prismaClient.users.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
      },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return {
      message: 'Find user successfully',
      user: user,
    };
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.findOne(id);
    const data: any = { ...updateUserDto };
    if (updateUserDto.password) {
      data.password = await hash(updateUserDto.password, 10);
    }
    const updateUser = await this.prismaClient.users.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        username: true,
      },
    });
    return {
      message: 'Update successfully!',
      user: updateUser,
    };
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prismaClient.users.delete({
      where: { id },
    });
    return {
      message: 'Delete user successfully',
    };
  }

  async findOneUserByUsername(username: string) {
    return await this.prismaClient.users.findUnique({
      where: { username: username },
      select: {
        id: true,
        email: true,
        username: true,
        password: true,
      },
    });
  }

  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }
}
