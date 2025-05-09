import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const message = (typeof exceptionResponse === 'object' && 'message' in exceptionResponse)
    ? (exceptionResponse as any).message
    : exception.message;

    response.status(status).json({
      success: false,
      timestamp: new Date().toISOString(),
      message,
      path: request.url,
    });
  }
}