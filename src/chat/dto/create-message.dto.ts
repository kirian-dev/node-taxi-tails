import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsBoolean } from 'class-validator';
import { ObjectId } from 'mongoose';

export class CreateMessageDto {
  @ApiProperty({ example: 'chatId', description: 'Chat ID' })
  @IsNotEmpty()
  @IsString()
  chatId: string | ObjectId;

  @ApiProperty({ example: 'userId', description: 'User ID' })
  @IsNotEmpty()
  @IsString()
  userId: string | ObjectId;

  @ApiProperty({
    example: 'Message content',
    description: 'Content of the message',
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({ example: true, description: 'Is the sender a driver?' })
  @IsNotEmpty()
  @IsBoolean()
  isDriver: boolean;
}
