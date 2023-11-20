import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AuthRoles } from 'src/common/enums/roles.enum';
import { PageOptionsDto } from 'src/common/helpers/pagination/pagination.dtos';
import { PageDto } from 'src/common/helpers/pagination/page.dto';
import { OrderStatus } from './schemas/order.schema';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Order } from './entities/order.entity';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import { IAuthUser } from 'src/common/interfaces/auth-user.interface';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Auth()
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'Order created successfully',
    type: Order,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    const createdOrder = await this.ordersService.createOrder(createOrderDto);
    return { success: true, data: createdOrder };
  }

  @Get()
  @Auth([AuthRoles.Driver])
  @ApiResponse({
    status: 200,
    description: 'List of orders',
    type: Order,
  })
  @ApiQuery({ name: 'status', description: 'Status by orders', type: String })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async getAllOrders(
    @Query() pageOptionsDto: PageOptionsDto,
    @Query('status') status: OrderStatus,
    @AuthUser() user: IAuthUser,
  ) {
    const filters: Partial<Order> = { status };
    const result: PageDto<Order> = await this.ordersService.getAllOrders(
      pageOptionsDto,
      filters,
      user.userId,
    );
    return { success: true, data: result.data, meta: result.meta };
  }

  @Get(':id')
  @Auth()
  @ApiResponse({
    status: 200,
    description: 'Order details',
    type: Order,
  })
  @ApiParam({ name: 'id', description: 'Order ID', type: String })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async getOrderById(@Param('id') id: string, @AuthUser() user: IAuthUser) {
    const order = await this.ordersService.getOrderById(id, user.userId);
    return { success: true, data: order };
  }

  @Put(':id')
  @Auth()
  @ApiResponse({
    status: 200,
    description: 'Order updated successfully',
    type: Order,
  })
  @ApiParam({ name: 'id', description: 'Order ID', type: String })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async updateOrder(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    const updatedOrder = await this.ordersService.updateOrder(
      id,
      updateOrderDto,
    );
    return { success: true, data: updatedOrder };
  }

  @Delete(':id')
  @Auth()
  @ApiResponse({
    status: 200,
    description: 'Order deleted successfully',
  })
  @ApiParam({ name: 'id', description: 'Order ID', type: String })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async deleteOrder(@Param('id') id: string) {
    const isDeleted = await this.ordersService.deleteOrder(id);
    return { success: true, data: isDeleted };
  }

  @Post(':id/driver/:driverId')
  @Auth([AuthRoles.Driver])
  @ApiResponse({
    status: 200,
    description: 'Order claimed successfully',
    type: Order,
  })
  @ApiParam({ name: 'id', description: 'Order ID', type: String })
  @ApiParam({ name: 'driverId', description: 'Driver ID', type: String })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async claimOrder(
    @Param('id') id: string,
    @Param('driverId') driverId: string,
  ) {
    const claimedOrder = await this.ordersService.updateOrderByDriver(
      id,
      driverId,
    );
    return { success: true, data: claimedOrder };
  }

  @Get('current-orders')
  @Auth([AuthRoles.Driver])
  @ApiResponse({
    status: 200,
    description: 'List of current orders for the driver',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async getCurrentOrdersForDriver(@AuthUser() user: IAuthUser) {
    const currentOrders = await this.ordersService.getCurrentOrdersForDriver(
      user.userId,
    );
    return { success: true, data: currentOrders };
  }
}
