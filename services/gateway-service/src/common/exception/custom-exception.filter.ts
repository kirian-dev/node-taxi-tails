import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { MongoError } from 'mongodb';
@Catch(Error)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  constructor() {}

  catch(error: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let status = 500; // Default status for general errors

    let errorMessage: string | object = 'Internal Server Error';

    if (error instanceof HttpException) {
      // If it's an HttpException, handle it specifically
      status = error.getStatus();

      const responseError = error.getResponse();

      if (typeof responseError === 'string') {
        errorMessage = responseError;
      } else if (
        typeof responseError === 'object' &&
        'message' in responseError
      ) {
        errorMessage = (responseError as { message: string }).message;
      }

      this.logger.error(errorMessage);
    } else if (error instanceof MongoError) {
      status = 500;
      errorMessage = 'MongoDB Error: ' + error.message;

      this.logger.error(errorMessage);
    } else {
      // For other general errors
      this.logger.error(error.message);
    }

    response?.status(status).json({
      statusCode: status,
      message: errorMessage,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
