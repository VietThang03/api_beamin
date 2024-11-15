import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';
import { User } from 'src/interface/user';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrdersService {

  constructor(
    private prismaClient: PrismaService
  ){}

  async create(createOrderDto: CreateOrderDto, user: User) {
    const {orderItems} = createOrderDto
    let totalPrice = 0;

    //xác thực xem hàng đặt còn trong kho hay không
    for(const item of orderItems){
      const food = await this.prismaClient.foods.findUnique({
        where:{id: item.food_id}
      })
      if(!food || food.stock < item.quantity){
        throw new HttpException('Không đủ hàng trong kho', HttpStatus.BAD_REQUEST)
      }
      const priceAsNumber = new Decimal(food.price).toNumber()
      totalPrice += item.quantity * priceAsNumber
    }

    //tạo đơn hàng
    const order = await this.prismaClient.orders.create({
      data:{
        user_id: Number(user.id),
        status: 'pending',
        total_price: Number(totalPrice),
        created_at: new Date(),
        order_items:{
          create: orderItems.map((item) => ({
            food_id: item.food_id,
            quantity: item.quantity,
            price: item.price
          }))
        }
      }
    })
    //cập nhập hàng tồn kho
    for(const item of orderItems){
      await this.prismaClient.foods.update({
        where:{id: item.food_id},
        data:{
          stock: {decrement: item.quantity}
        }
      })
      await this.prismaClient.inventory.update({
        where:{food_id: item.food_id},
        data:{
          quantity:{decrement: item.quantity}
        }
      })
    }

    return {
      message: 'Create order successfully',
      data: order
    };
  }

  async findAll(page: number, limit: number, user: User) {
    const totalRecords = await this.prismaClient.orders.count();
    const totalPages = Math.ceil(totalRecords / limit);
    const defaultLimit = limit ? limit : 20;
    const defaultPage = page ? page : 1;

    const orders = await this.prismaClient.orders.findMany({
      include:{
        order_items: true
      },
      skip: (defaultPage - 1) * limit,
      take: defaultLimit
    })
    return {
      message: 'Get all order successfully!!!',
      meta: {
        current: page,
        pageSize: limit,
        pages: totalPages,
        total: totalRecords,
      },
      data: orders,
    };
  }

  async findOne(id: number) {
    const order = await this.prismaClient.orders.findUnique({
      where: {
        id
      },
      include:{
        order_items: true
      }
    })
    if(!order){
      throw new NotFoundException(`Order with ID ${id} not found`)
    }
    return {
      message: 'Find order successfully!',
      data: order
    };
  }

  async findOrderUserId(user: User) {
    const orderUser = await this.prismaClient.orders.findMany({
      where: {
        user_id: Number(user.id)
      },
      include:{
        order_items: true
      }
    })
    if(!orderUser){
      throw new NotFoundException(`Order with ID ${user.id} not found`)
    }
    return {
      message: 'Find order successfully!',
      data: orderUser
    };
  }

  async confirmPayment(id: number){
    await this.findOne(id)
    const updateStatusOrder = await this.prismaClient.orders.update({
      where: {id},
      data:{
        status: 'confirmed'
      }
    })
    return {
      message: 'Update status order successfully!',
      data: updateStatusOrder
    }
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const {orderItems} = updateOrderDto
    let totalPrice = 0;

    //xác thực xem hàng đặt còn trong kho hay không
    for(const item of orderItems){
      const food = await this.prismaClient.foods.findUnique({
        where:{id: item.food_id}
      })
      if(!food || food.stock < item.quantity){
        throw new HttpException('Không đủ hàng trong kho', HttpStatus.BAD_REQUEST)
      }
      const priceAsNumber = new Decimal(food.price).toNumber()
      totalPrice += item.quantity * priceAsNumber
    }
    await this.prismaClient.order_items.deleteMany({
      where: { order_id: id },
    });
  
    // Cập nhật đơn hàng và tạo lại các order_items
    const updatedOrder = await this.prismaClient.orders.update({
      where: { id: id },
      data: {
        total_price: Number(totalPrice),
        order_items: {
          create: orderItems.map((item) => ({
            food_id: item.food_id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });
     //cập nhập hàng tồn kho
     for(const item of orderItems){
      await this.prismaClient.foods.update({
        where:{id: item.food_id},
        data:{
          stock: {decrement: item.quantity}
        }
      })
      await this.prismaClient.inventory.update({
        where:{food_id: item.food_id},
        data:{
          quantity:{decrement: item.quantity}
        }
      })
    }
    
      return {
        message: 'Update order successfully',
        data: updatedOrder
      };
  }

  async remove(id: number) {
    await this.findOne(id)
    // Xóa tất cả các order_items liên quan
  await this.prismaClient.order_items.deleteMany({
    where: { order_id: id },
  });

  // Xóa đơn hàng
   await this.prismaClient.orders.delete({
    where: { id: id },
  });

  return {
    message: 'Đơn hàng đã được xóa thành công'
  };
  }
}
