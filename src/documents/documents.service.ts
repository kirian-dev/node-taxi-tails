import { Injectable } from '@nestjs/common';
import { DocumentsRepository } from './documents.repository';
import { CreateDocumentDto } from './dto/create-document.dto';
import { Document } from './entities/document.entity';
import { UsersRepository } from 'src/users/users.repository';
import { PageOptionsDto } from 'src/common/helpers/pagination/pagination.dtos';
import { PageDto } from 'src/common/helpers/pagination/page.dto';
import { PageMetaDto } from 'src/common/helpers/pagination/page-meta.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';

@Injectable()
export class DocumentsService {
  constructor(
    private readonly documentsRepository: DocumentsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async createDocument(
    createDocumentDto: CreateDocumentDto,
  ): Promise<Document> {
    try {
      const { userId } = createDocumentDto;
      const newDoc = await this.documentsRepository.create(createDocumentDto);

      await this.usersRepository.updateStatusDocs(userId, true);

      return newDoc;
    } catch (error) {
      throw error;
    }
  }

  async getAllDocuments(
    pageOptionsDto: PageOptionsDto,
    filters?: Partial<Document>,
  ): Promise<PageDto<Document>> {
    try {
      const documents = await this.documentsRepository.findAll(
        pageOptionsDto,
        filters,
      );
      const totalCount = await this.documentsRepository.countAll();

      const meta = new PageMetaDto({
        pageOptionsDto,
        itemCount: totalCount,
      });

      return new PageDto(documents, meta);
    } catch (error) {
      throw error;
    }
  }

  async getDocumentById(id: string): Promise<Document | null> {
    return this.documentsRepository.findById(id);
  }

  async updateDocument(
    id: string,
    updateDocumentDto: UpdateDocumentDto,
  ): Promise<Document | null> {
    return this.documentsRepository.update(id, updateDocumentDto);
  }

  async deleteDocument(id: string): Promise<boolean> {
    return this.documentsRepository.remove(id);
  }
}
