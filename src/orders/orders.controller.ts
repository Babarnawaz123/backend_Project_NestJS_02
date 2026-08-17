import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  Request,
  SetMetadata,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../users/schemas/user.schema';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);

@ApiTags('orders')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // POST /orders // USER
  @Post('orders')
  @Roles(Role.USER, Role.ADMIN)
  async createOrder(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    return this.ordersService.createOrder(createOrderDto, req.user.userId);
  }

  // GET /past-orders // ADMIN - CUSTOMER
  @Get('past-orders')
  @Roles(Role.USER, Role.ADMIN)
  async getPastOrders(@Request() req) {
    return this.ordersService.getPastOrders(req.user);
  }

  // GET /past-order/:order_id // ADMIN - CUSTOMER
  @Get('past-order/:order_id')
  @Roles(Role.USER, Role.ADMIN)
  async getPastOrderById(@Param('order_id') orderId: string, @Request() req) {
    return this.ordersService.getPastOrderById(orderId, req.user);
  }
}
