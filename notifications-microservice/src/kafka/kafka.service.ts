import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Consumer, Kafka, Producer } from 'kafkajs/types';
import logger from '@common/logger/winston-logger';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private kafka = new Kafka({ brokers: ['localhost:9092'] });
  private consumer: Consumer;
  private producer: Producer;

  // This code initializes a Kafka consumer and producer within a module.
  // Upon module initialization, it connects to the Kafka consumer with a specified group ID ('order-group')
  // and also establishes a connection to the Kafka producer for sending messages.
  async onModuleInit() {
    this.consumer = this.kafka.consumer({ groupId: 'order-group' });
    await this.consumer.connect();
    this.producer = this.kafka.producer();
    await this.producer.connect();
  }

  // This function sends a message to a specified Kafka topic by using a producer instance. 
  // The message is serialized to a JSON string before being sent.
  async sendMessage(topic: string, message: any) {
    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
  }

// This method subscribes to a specified Kafka topic and processes incoming messages using a callback function. 
// It initializes the consumer to listen for messages from the specified topic and invokes the callback with 
// the parsed message content whenever a new message is received.
async subscribe(topic: string, callback: (message: any) => void) {
    await this.consumer.subscribe({ topic, fromBeginning: false });
    await this.consumer.run({
      eachMessage: async ({ message }) => {
        if(message.value){
          try{
            const parsedMessage = JSON.parse(message.value.toString());
            callback(parsedMessage)
          }catch(e){
            logger.error('Failed to parse message: error: ',e);   
          }
        }
      },
    });
  }

  async onModuleDestroy() {
    await this.consumer.disconnect();
    await this.producer.disconnect();
  }
}
