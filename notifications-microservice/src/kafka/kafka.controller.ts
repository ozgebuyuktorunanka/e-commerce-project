import { Controller, Get } from '@nestjs/common';
import { KafkaService } from './kafka.service';

@Controller()
export class AppController {
  constructor(private readonly appService: KafkaService) {}
}
