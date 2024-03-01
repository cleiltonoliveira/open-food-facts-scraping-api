import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus,  } from '@nestjs/common';
import { Request, Response } from 'express';
import BadRequestException from './custom-exceptions/bad-request-exception';
import NotFoundException from './custom-exceptions/not-found-exception';
import GatewayTimeoutException from './custom-exceptions/gateway-timeout-exception';
import BadGatewayException from './custom-exceptions/bad-gateway-exception';
import ErrorResponse from './error-response';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let errorBody: ErrorResponse
    
    if (exception instanceof GatewayTimeoutException) {
      errorBody = this.buildErrorBody(HttpStatus.GATEWAY_TIMEOUT, request.url, exception.message)
    } else if (exception instanceof BadGatewayException) {
      errorBody = this.buildErrorBody(HttpStatus.BAD_GATEWAY, request.url, exception.message)
    } else if (exception instanceof BadRequestException) {
      errorBody = this.buildErrorBody(HttpStatus.BAD_REQUEST, request.url, exception.message)
    } else if (exception instanceof NotFoundException) {
      errorBody = this.buildErrorBody(HttpStatus.NOT_FOUND, request.url, exception.message)
    } else {
      errorBody = this.buildErrorBody( exception instanceof HttpException ? exception.getStatus() : 500, request.url, exception.message)
    }

    response
      .status(errorBody.statusCode)
      .json(errorBody);
  }

  buildErrorBody(statusCode: any, path: any, message: any) {
    return {
      statusCode: statusCode,
      timestamp: new Date().toISOString(),
      path: path,
      message: message || ''
    }
  }
}
