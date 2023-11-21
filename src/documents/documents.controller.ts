import { AuthUser } from './../auth/decorators/auth-user.decorator';
import { CreateDocumentDto } from './dto/create-document.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthRoles } from 'src/common/enums/roles.enum';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { IAuthUser } from 'src/common/interfaces/auth-user.interface';
import { PageDto } from 'src/common/helpers/pagination/page.dto';
import { PageOptionsDto } from 'src/common/helpers/pagination/pagination.dtos';
import { Document } from './entities/document.entity';
import { UpdateDocumentDto } from './dto/update-document.dto';

Auth([AuthRoles.Driver]);
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @Auth([AuthRoles.Driver])
  @ApiOperation({ summary: 'Create a new document' })
  @ApiResponse({
    status: 201,
    description: 'Document created successfully',
    type: Document,
  })
  async createDocument(
    @Body() createDocumentDto: CreateDocumentDto,
    @AuthUser() user: IAuthUser,
  ) {
    const userId = user?.userId;
    const createdDocument = await this.documentsService.createDocument({
      ...createDocumentDto,
      userId,
    });

    return { success: true, data: createdDocument };
  }

  @Get()
  @Auth([AuthRoles.Admin])
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'List of documents',
    type: Document,
  })
  @ApiQuery({ name: 'page', description: 'Page number', type: Number })
  @ApiQuery({
    name: 'limit',
    description: 'Number of items per page',
    type: Number,
  })
  async getAllDocuments(@Query() pageOptionsDto: PageOptionsDto) {
    const result: PageDto<Document> =
      await this.documentsService.getAllDocuments(pageOptionsDto);
    return { success: true, data: result.data, meta: result.meta };
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Document details',
    type: Document,
  })
  @ApiParam({ name: 'id', description: 'Document ID', type: String })
  async getDocumentById(@Param('id') id: string) {
    const document = await this.documentsService.getDocumentById(id);
    return { success: true, data: document };
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Document updated successfully',
    type: Document,
  })
  @ApiParam({ name: 'id', description: 'Document ID', type: String })
  async updateDocument(
    @Param('id') id: string,
    @Body() updateDocumentDto: UpdateDocumentDto,
  ) {
    const updatedDocument = await this.documentsService.updateDocument(
      id,
      updateDocumentDto,
    );
    return { success: true, data: updatedDocument };
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Document deleted successfully',
  })
  @ApiParam({ name: 'id', description: 'Document ID', type: String })
  async deleteDocument(@Param('id') id: string) {
    const isDeleted = await this.documentsService.deleteDocument(id);
    return { success: true, data: isDeleted };
  }
}
