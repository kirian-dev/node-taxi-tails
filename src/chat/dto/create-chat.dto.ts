import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { ObjectId } from 'mongoose';

export class CreateChatDto {
  @ApiProperty({ example: 'userId', description: 'User ID' })
  @IsNotEmpty()
  @IsString()
  userId: string | ObjectId;

  @ApiProperty({ example: 'driverId', description: 'Driver ID' })
  @IsNotEmpty()
  @IsString()
  driverId: string | ObjectId;
}
