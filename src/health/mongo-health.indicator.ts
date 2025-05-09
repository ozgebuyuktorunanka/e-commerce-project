import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { HealthIndicator, HealthIndicatorResult, HealthCheckError } from '@nestjs/terminus';
import { Connection } from 'mongoose';

@Injectable()
export class MongoHealthIndicator extends HealthIndicator {
  constructor(
    @InjectConnection() private readonly connection: Connection,
  ) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      // MongoDB bağlantı durumunu kontrol et
      const status = this.connection.readyState;
      const isHealthy = status === 1; // 1 = connected

      // Eğer bağlantı sağlıklı değilse
      if (!isHealthy) {
        throw new HealthCheckError(
          'MongoDB health check failed',
          this.getStatus(key, false, { status }),
        );
      }

      return this.getStatus(key, true, { status });
    } catch (error) {
      throw new HealthCheckError(
        'MongoDB health check failed',
        this.getStatus(key, false, { error: error.message }),
      );
    }
  }
}