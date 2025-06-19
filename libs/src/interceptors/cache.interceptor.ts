import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RedisService } from '@apigateway/redis/redis.service';
import logger from '../logger/winston-logger';

@Injectable()
/**
 * CacheInterceptor: A NestJS interceptor that implements caching logic using Redis.
 * It checks if a response for a given request URL exists in the cache.
 * If found, it returns the cached data immediately.
 * Otherwise, it allows the request to proceed, caches the successful response, and then returns it.
 * This helps to improve application performance by reducing redundant computations and database calls.
 */
export class CacheInterceptor implements NestInterceptor {
  constructor(private readonly redisService: RedisService) { }

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const key = `cache:${request.url}`;

    try {
      const cachedData = await this.redisService.get(key);
      if (cachedData) {
        logger.info(`Cache hit for key: ${key}`);
        return of(JSON.parse(cachedData));
      }
    } catch (error) {
      logger.error('Cache get error:', error);
    }

    return next.handle().pipe(
      tap(async (data) => {
        try {
          await this.redisService.set(key, JSON.stringify(data), 300); // 5 dakika TTL
          logger.info(`Data cached for key: ${key}`);
        } catch (error) {
          logger.error('Cache set error:', error);
        }
      }),
    );
  }
}
