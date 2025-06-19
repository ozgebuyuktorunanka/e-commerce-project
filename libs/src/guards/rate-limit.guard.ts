import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { RedisService } from '@apigateway/redis/redis.service';
import logger from '../../../libs/src/logger/winston-logger';

/**
 * RateLimitGuard: A NestJS guard that enforces a rate limit on incoming requests.
 * It uses Redis to track the number of requests from a client (identified by IP) within a specific timeframe (e.g., 60 seconds).
 * If a client exceeds the defined request limit (e.g., 100 requests per minute), it rejects the request with a 'Too Many Requests' HTTP exception.
 * This helps protect the application from abuse, denial-of-service attacks, and ensures fair resource usage.
 */
@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(private readonly redisService: RedisService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const clientId = request.ip || request.headers['x-forwarded-for'] || 'unknown';
    const key = `rate_limit:${clientId}`;

    try {
      const current = await this.redisService.incr(key);
      
      if (current === 1) {
        await this.redisService.expire(key, 60);
      }
      
      if (current > 100) { // 100 request/minute limit
        logger.warn(`Rate limit exceeded for client: ${clientId}`);
        //This HTTP request : status code : 429 Too Many Requests
        throw new HttpException('Rate limit exceeded', HttpStatus.TOO_MANY_REQUESTS);
      }

      return true;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      logger.error('Rate limiter error:', error);
      return true; 
    }
  }
}