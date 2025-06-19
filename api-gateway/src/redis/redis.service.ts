import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';
import logger from '@common/logger/winston-logger';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: RedisClientType;
  private isConnected: boolean = false; //For watching the connected status

  constructor() {
    this.client = createClient({
      socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
      password: process.env.REDIS_PASSWORD,
    });

    this.client.on('error', (err) => {
      logger.error('Redis Client Error:', err);
    });

    this.client.on('connect', () => {
      logger.info('Redis connected successfully');
    });

    this.client.on('end', () => {
      this.isConnected = false;
      logger.warn('Redis connection ended');
    });

    this.client.on('reconnecting', () => {
      logger.info('Redis is trying to reconnect...');
    });
  }

  async onModuleInit() {
    await this.connectWithRetry();
  }
  private async connectWithRetry(retries = 5, delay = 1000) {
    for (let i = 0; i < retries; i++) {
      try {
        await this.client.connect();
        this.isConnected = true;
        logger.info('Redis connection established.');
        return
      } catch (error) {
        this.isConnected = false;
        logger.error(`Redis connetion failed ( attempt ${i+1}/${retries}:)`,error.message);
        if (i < retries - 1) {
          await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, i))); 
          logger.error('Redis connection failed after multiple retries. Application may not function correctly.');
        }
      }
    }
  }

  async onModuleDestroy() {
    await this.client.quit();
  }

  getClient(): RedisClientType {
    return this.client;
  }

  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.client.setEx(key, ttl, value);
    } else {
      await this.client.set(key, value);
    }
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async incr(key: string): Promise<number> {
    return await this.client.incr(key);
  }

  async expire(key: string, seconds: number): Promise<void> {
    await this.client.expire(key, seconds);
  }
}

