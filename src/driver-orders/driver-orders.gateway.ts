import {
  WebSocketGateway,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Inject, Injectable, UseInterceptors } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UsersService } from 'src/users/users.service';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { Cache } from 'cache-manager';
import { DriverOrdersService } from './driver-orders.service';
import { TIME_DRIVER_IN_CACHE } from 'src/common/consts/consts';
import { CACHE_MANAGER, CacheInterceptor } from '@nestjs/cache-manager';

@WebSocketGateway()
@ApiTags('Driver Orders')
@UseInterceptors(CacheInterceptor)
@Injectable()
export class DriverOrdersGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly server: Server;

  constructor(
    private readonly ordersService: DriverOrdersService,
    private readonly usersService: UsersService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async handleConnection(client: Socket) {
    const userId = this.getUserBySocketConnection(client);
    if (userId) {
      await this.cacheManager.set(userId, client.id, TIME_DRIVER_IN_CACHE);
    }
  }

  async handleDisconnect(client: Socket) {
    const userId = this.getUserBySocketConnection(client);
    if (userId) {
      await this.cacheManager.del(userId);
    }
  }

  @SubscribeMessage('connectToOrders')
  @ApiResponse({
    status: 200,
    description: 'Connect to orders and receive nearby orders',
  })
  async handleConnectToOrders(
    client: Socket,
    data: { coordinates: [number, number] },
  ) {
    const { coordinates } = data;
    const nearbyOrders =
      await this.ordersService.findOrdersNearGivenDriverCoordinates(
        coordinates,
      );
    this.cacheManager.set('id', client.id, TIME_DRIVER_IN_CACHE);
    const userId = this.getUserBySocketConnection(client);
    if (userId) {
      this.server.to(client.id).emit('nearbyOrders', { nearbyOrders });
    }
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  @ApiResponse({
    status: 200,
    description: 'Notify drivers of proximity to orders',
  })
  async handleCron() {
    try {
      const allDrivers = await this.usersService.findAllDrivers();
      for (const driver of allDrivers) {
        const { coordinates, id: driverId } = driver;
        if (!coordinates.length) {
          console.error(`Driver ${driverId} does not have coordinates.`);
          continue;
        }
        const nearbyOrders =
          await this.ordersService.findOrdersNearGivenDriverCoordinates(
            coordinates,
          );
        const socketId = (await this.cacheManager.get(driverId)) as string;
        if (socketId) {
          this.server.to(socketId).emit('nearbyOrders', { nearbyOrders });
        }
      }
    } catch (error) {
      console.error('Error updating nearby orders for drivers:', error);
    }
  }

  private getUserBySocketConnection(client: Socket): string | undefined {
    const userId =
      client.handshake.query?.userId || client.handshake.query?.driverId;
    return userId && Array.isArray(userId) ? userId[0] : userId;
  }
}
