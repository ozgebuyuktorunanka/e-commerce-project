import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Consumer, ConsumerRunConfig, ConsumerSubscribeTopics, Kafka } from 'kafkajs';

@Injectable()
export class ConsumerService implements OnApplicationShutdown {
  private readonly kafka: Kafka;
  private readonly consumers: Consumer[] = [];

  constructor(private readonly configService: ConfigService) {
    this.kafka = new Kafka({
        clientId : this.configService.get<string>('KAFKA_CLIENT_ID'),
        brokers : this.configService.get<string>('KAFKA_BROKER')?.split(',') || ['localhost:9092'],
      });
  }

  async consume(topic: ConsumerSubscribeTopics, config: ConsumerRunConfig) {
    const consumer = this.kafka.consumer({ 
      groupId: this.configService.get('KAFKA_CONSUMER_GROUP_ID') + '-notification'
    });
    
    //with this code connect() , the consumer can be able to connects to the kafka broker.
    await consumer.connect(); 

    //It subscribes to the specified topic
    await consumer.subscribe(topic);

    //The consumer starts running with the provided configuration
    await consumer.run(config);

    //The newly created consumer instance is added to the consumers array for later management.
    this.consumers.push(consumer);
  }

  //Automatically when the application is shutting down.
  async onApplicationShutdown() {
    for (const consumer of this.consumers) {  //It iterates over the consumers array
        //a clean shutdown process by disconnecting all active consumers.
        await consumer.disconnect();
    }
  }
}