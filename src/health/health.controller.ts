import { Controller, Get } from '@nestjs/common';
import { 
  HealthCheck, 
  HealthCheckService, 
  MemoryHealthIndicator 
} from '@nestjs/terminus';
import { MongoHealthIndicator } from './mongo-health.indicator';

@Controller('health')
export class HealthController {
  http: any;
  constructor(
    private health: HealthCheckService,
    private mongo: MongoHealthIndicator,
    private memory: MemoryHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.mongo.isHealthy('mongodb'),
      () => this.memory.checkHeap('memory_heap', 200 * 1024 * 1024),
      () => this.memory.checkRSS('memory_rss', 300 * 1024 * 1024),
      () => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),
      () => this.http.pingCheck('postgres', 'postgresql://postgres:postgres@localhost:5432/postgres'),
      () => this.http.pingCheck('mongodb', 'mongodb://localhost:27017/commerce'),
      () => this.http.pingCheck('redis', 'redis://localhost:6379'),
    ]);
  }
}
