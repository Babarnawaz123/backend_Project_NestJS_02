import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { Role } from '../users/schemas/user.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto, userId: string) {
    const newOrder = new this.orderModel({
      ...createOrderDto,
      userId,
    });
    return newOrder.save();
  }

  async getPastOrders(user: any) {
    if (user.role === Role.ADMIN) {
      return this.orderModel
        .find()
        .populate('userId', 'name email')
        .populate('items.productId')
        .exec();
    }
    return this.orderModel
      .find({ userId: user.userId })
      .populate('items.productId')
      .exec();
  }

  async getPastOrderById(orderId: string, user: any) {
    const order = await this.orderModel
      .findById(orderId)
      .populate('userId', 'name email')
      .populate('items.productId')
      .exec();

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found.`);
    }

    if (user.role !== Role.ADMIN && order.userId.toString() !== user.userId) {
      throw new ForbiddenException('You do not have access to this order.');
    }

    return order;
  }
}
