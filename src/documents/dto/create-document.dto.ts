import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDocumentDto {
  @ApiProperty({ example: 'DriverLicense', description: 'Document type' })
  @IsNotEmpty()
  @IsString()
  documentType: string;

  @ApiProperty({ example: '123456789', description: 'Document number' })
  @IsNotEmpty()
  @IsString()
  documentNumber: number;

  @ApiProperty({ example: 'AC', description: 'Series' })
  @IsNotEmpty()
  @IsString()
  series: string;

  @ApiProperty({ example: '2023-01-01', description: 'Date of issue' })
  @IsNotEmpty()
  @IsString()
  issueDate: string;

  @ApiProperty({ example: 'userId', description: 'User ID' })
  @IsOptional()
  @IsString()
  userId: string;
}
