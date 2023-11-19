import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Document, DocumentDocument } from './schemas/document.schema';
import { CreateDocumentDto } from './dto/create-document.dto';
import { PageOptionsDto } from 'src/common/helpers/pagination/pagination.dtos';
import { Order } from 'src/common/enums/system.enum';
import { DEFAULT_ITEMS_PER_PAGE } from 'src/common/consts/consts';
import { UpdateDocumentDto } from './dto/update-document.dto';

@Injectable()
export class DocumentsRepository {
  constructor(
    @InjectModel(Document.name)
    private readonly documentModel: Model<Document>,
  ) {}

  async create(documentData: CreateDocumentDto): Promise<Document> {
    try {
      const newDocument = new this.documentModel(documentData);
      return await newDocument.save();
    } catch (error) {
      throw error;
    }
  }

  async findAll(
    pageOptionsDto: PageOptionsDto,
    filters?: Partial<Document>,
  ): Promise<DocumentDocument[]> {
    try {
      const { skip, take, order } = pageOptionsDto;

      const sort: { [key: string]: 'asc' | 'desc' } = {};
      if (order) {
        sort.createdAt = order === Order.ASC ? 'asc' : 'desc';
      }

      const query = { ...filters };

      return await this.documentModel
        .find(query)
        .sort(sort)
        .skip(skip)
        .limit(take || DEFAULT_ITEMS_PER_PAGE)
        .exec();
    } catch (error) {
      throw error;
    }
  }

  async findById(id: string): Promise<DocumentDocument | null> {
    return this.documentModel.findById(id).exec();
  }

  async update(
    id: string,
    updateDocumentDto: UpdateDocumentDto,
  ): Promise<DocumentDocument | null> {
    return this.documentModel
      .findByIdAndUpdate(id, updateDocumentDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.documentModel.deleteOne({ _id: id }).exec();
    return result.deletedCount > 0;
  }
  async countAll(): Promise<number> {
    try {
      return await this.documentModel.countDocuments().exec();
    } catch (error) {
      throw error;
    }
  }
}
