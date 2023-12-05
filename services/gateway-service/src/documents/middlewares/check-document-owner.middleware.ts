import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { IAuthUser } from 'src/common/interfaces/auth-user.interface';
import { DocumentsRepository } from '../../documents/documents.repository';
import { documentErrors } from 'src/common/error/document.error';
import { IDocumentRequest } from 'src/common/interfaces/document.interface';

@Injectable()
export class CheckDocumentOwnerMiddleware implements NestMiddleware {
  constructor(private readonly documentsRepository: DocumentsRepository) {}

  async use(req: IDocumentRequest, res: Response, next: NextFunction) {
    const documentId: string = req.params.id;
    const userId: string = (req.user as IAuthUser)?.userId;

    try {
      const document = await this.documentsRepository.findById(documentId);
      if (!document) {
        throw documentErrors.DocumentNotFoundError;
      }

      if (document.userId.toString() !== userId) {
        throw documentErrors.UserDocumentNotFoundError;
      }

      req.document = document;

      next();
    } catch (error) {
      next(error);
    }
  }
}
