import { Module, RequestMethod, MiddlewareConsumer } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { CheckDocumentOwnerMiddleware } from './middlewares/check-document-owner.middleware';
import { DocumentsRepository } from './documents.repository';
import { UsersModule } from 'src/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentSchema } from './schemas/document.schema';
import { Document } from './entities/document.entity';
import { UsersRepository } from 'src/users/users.repository';
import { User } from 'src/users/entities/user.entity';
import { UserSchema } from 'src/users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Document.name, schema: DocumentSchema },
    ]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    UsersModule,
  ],
  controllers: [DocumentsController],
  providers: [DocumentsService, UsersRepository, DocumentsRepository],
  exports: [DocumentsRepository],
})
export class DocumentsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CheckDocumentOwnerMiddleware)
      .forRoutes(
        { path: 'documents/:id', method: RequestMethod.GET },
        { path: 'documents/:id', method: RequestMethod.PUT },
        { path: 'documents/:id', method: RequestMethod.DELETE },
      );
  }
}
