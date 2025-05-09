import { Module } from "@nestjs/common";
import { TerminusModule } from '@nestjs/terminus';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { MongoHealthIndicator } from "./mongo-health.indicator";
import { HealthController } from "./health.controller";

@Module({
  imports: [
    TerminusModule,
    HttpModule,
    MongooseModule,
  ],
  controllers: [HealthController],
  providers: [MongoHealthIndicator],
})
export class HealthModule {}
