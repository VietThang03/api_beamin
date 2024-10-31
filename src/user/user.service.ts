import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { compareSync, genSaltSync, hashSync, hash } from 'bcrypt';

@Injectable()
export class UserService {

  constructor(
    private prismaClient : PrismaService
  ){}

  hashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  };

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(id: number) {
    const user = await this.prismaClient.users.findUnique({
      where: {id},
      select:{
        id: true,
        email: true,
        username: true
      }
    })
    if(!user){
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return {
      message: 'Find user successfully',
      user: user
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.findOne(id) 
    const data: any = {...updateUserDto}
    if(updateUserDto.password){
      data.password = await hash(updateUserDto.password, 10)
    }
    const updateUser = await this.prismaClient.users.update({
      where: {id},
      data,
      select:{
        id: true,
        email: true,
        username: true
      }
    })
    return {
      message: 'Update successfully!',
      user: updateUser
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prismaClient.users.delete({
      where: {id}
    })
    return {
      message: 'Delete user successfully',
    }
  }

  async findOneUserByUsername(username: string){
    return await this.prismaClient.users.findUnique({
      where:{username: username},
      select:{
        id: true,
        email: true,
        username: true,
        password: true
      }
    })
  }

  isValidPassword(password: string, hash: string){
    return compareSync(password, hash);
  }
}
