import { DocumentDocument } from './../../documents/schemas/document.schema';
import { Request } from 'express';

export interface IDocumentRequest extends Request {
  document?: DocumentDocument;
}
