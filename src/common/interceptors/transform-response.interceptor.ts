// These are core decorators and types from the NestJS framework
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

// Observable type from RxJS, used for asynchronous data streams
import { Observable } from 'rxjs';

// map operator from RxJS, used to transform emitted values
import { map } from 'rxjs/operators';

// This interface defines the structure of the standardized response returned by the interceptor
export interface Response<T> {
  success: boolean;
  timestamp: string;
  data: T;
}

// This interceptor transforms all successful responses to follow a consistent format

@Injectable()
export class TransformResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map(data => ({
        success: true,
        timestamp: new Date().toISOString(),
        data,
      })),
    );
  }
}