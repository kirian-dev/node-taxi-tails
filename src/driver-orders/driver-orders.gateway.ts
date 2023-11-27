import {
  WebSocketGateway,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UsersService } from 'src/users/users.service';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { DriverOrdersService } from './driver-orders.service';

@WebSocketGateway()
@ApiTags('Driver Orders')
@Injectable()
export class DriverOrdersGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly activeConnections = new Map<string, string>();
  private readonly server: Server;

  constructor(
    private readonly ordersService: DriverOrdersService,
    private readonly usersService: UsersService,
  ) {}

  handleConnection(client: Socket) {
    const idOrDriverId = this.getUserBySocketConnection(client);
    if (idOrDriverId) {
      this.activeConnections.set(client.id, idOrDriverId);
    }
  }

  handleDisconnect(client: Socket) {
    this.activeConnections.delete(client.id);
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
    const driverId = this.activeConnections.get(client.id);
    if (driverId) {
      this.server.to(client.id).emit('nearbyOrders', { nearbyOrders });
    }
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
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

        const socketId = this.activeConnections.get(driverId);
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
