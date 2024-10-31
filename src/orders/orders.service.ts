import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class OrdersService {

  constructor(
    private prismaClient: PrismaService
  ){}

  async create(createOrderDto: CreateOrderDto) {
    const {orderItems, user_id} = createOrderDto
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
        user_id: user_id,
        status: 'pending',
        total_price: totalPrice,
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

  findAll() {
    return `This action returns all orders`;
  }

  async findOne(id: number) {
    const order = await this.prismaClient.orders.findUnique({
      where: {
        id
      },
    })
    if(!order){
      throw new NotFoundException(`Order with ID ${id} not found`)
    }
    return {
      message: 'Find order successfully!',
      data: order
    };
  }

  async confirmPayment(id: number){
    await this.findOne(id)
    const updateStatusOrder = await this.prismaClient.orders.update({
      where: {id},
      data:{
        status: 'confirm'
      }
    })
    return {
      message: 'Update status order successfully!',
      data: updateStatusOrder
    }
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
