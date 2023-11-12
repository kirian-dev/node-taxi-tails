import { Injectable } from '@nestjs/common';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';
import { config } from './config';

@Injectable()
export class MongooseConfig implements MongooseOptionsFactory {
  createMongooseOptions(): MongooseModuleOptions {
    const { mongoDBUri, mongoDBName } = config();
    return {
      uri: mongoDBUri,
      dbName: mongoDBName,
    };
  }
}
