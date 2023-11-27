// driver-orders.gateway.ts
import {
  WebSocketGateway,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { DriverOrdersService } from './driver-orders.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UsersService } from 'src/users/users.service';

@WebSocketGateway()
@Injectable()
export class DriverOrdersGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private activeConnections: Map<string, string>;
  private server: Server;

  constructor(
    private readonly ordersService: DriverOrdersService,
    private readonly usersService: UsersService,
  ) {
    this.activeConnections = new Map();
  }

  handleConnection(client: Socket) {
    const idOrDriverId = this.getClientIdOrDriverId(client);
    if (idOrDriverId) {
      this.activeConnections.set(client.id, idOrDriverId);
    }
  }

  handleDisconnect(client: Socket) {
    this.activeConnections.delete(client.id);
  }

  @SubscribeMessage('connectToOrders')
  async handleConnectToOrders(
    client: Socket,
    data: {
      coordinates: [number, number];
    },
  ) {
    const { coordinates } = data;
    const nearbyOrders =
      await this.ordersService.findOrdersNearCoordinates(coordinates);
    const driverId = this.activeConnections.get(client.id);
    if (driverId) {
      this.server.to(client.id).emit('nearbyOrders', { nearbyOrders });
    }
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleCron() {
    await this.updateNearbyOrdersForDrivers();
  }

  private async updateNearbyOrdersForDrivers() {
    try {
      const allDrivers = await this.usersService.findAllDrivers();

      for (const driver of allDrivers) {
        if (!driver.coordinates) {
          console.error(`Driver ${driver.id} does not have coordinates.`);
          continue;
        }

        const nearbyOrders = await this.ordersService.findOrdersNearCoordinates(
          driver.coordinates,
        );

        const socketId = this.activeConnections.get(driver.id);

        if (socketId) {
          this.server.to(socketId).emit('nearbyOrders', { nearbyOrders });
        }
      }
    } catch (error) {
      console.error('Error updating nearby orders for drivers:', error);
    }
  }

  private getClientIdOrDriverId(client: Socket): string | undefined {
    const userId = client.handshake.query?.userId;
    const driverId = client.handshake.query?.driverId;

    if (userId) {
      return Array.isArray(userId) ? userId[0] : userId;
    }

    if (driverId) {
      return Array.isArray(driverId) ? driverId[0] : driverId;
    }

    return undefined;
  }
}
