import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  constructor() {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    let errorMessage: string | object = 'Internal Server Error';

    if (exception instanceof HttpException) {
      const responseError = exception.getResponse();

      if (typeof responseError === 'string') {
        errorMessage = responseError;
      } else if (
        typeof responseError === 'object' &&
        'message' in responseError
      ) {
        errorMessage = (responseError as { message: string }).message;
      }

      this.logger.error(errorMessage);
    }

    response.status(status).json({
      statusCode: status,
      message: errorMessage,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
