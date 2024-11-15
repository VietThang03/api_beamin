import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';
import { FoodsModule } from './foods/foods.module';
import { FoodCategoriesModule } from './food-categories/food-categories.module';
import { OrdersModule } from './orders/orders.module';
import { SearchModule } from './search/search.module';

@Module({
  imports: [UserModule, PrismaModule,  ConfigModule.forRoot({
    isGlobal: true
  }), AuthModule, FilesModule, FoodsModule, FoodCategoriesModule, OrdersModule, SearchModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
