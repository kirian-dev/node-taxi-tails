import { DocumentDocument } from './../../documents/schemas/document.schema';
import { Request } from 'express';

export interface DocumentRequest extends Request {
  document?: DocumentDocument;
}
