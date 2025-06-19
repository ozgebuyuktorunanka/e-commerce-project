import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { PRODUCTS_PATTERNS } from '../../libs/src/types/types';

@Injectable()
export class StockService {
  constructor(
    @Inject('PRODUCTS_MICROSERVICE')
    private readonly productsMicroservice: ClientProxy,
  ) {}
  async decreaseStock(
    orderItems: Array<{ productId: number; quantity: number }>,
  ) {
    for (const item of orderItems) {
       await firstValueFrom(
         this.productsMicroservice.send(
           { cmd: PRODUCTS_PATTERNS.Decrease },
           item,
         ),
       ); //await olmassa istek atmıyor gözünden kaçırma böyle şeyleri çaylak
      console.log('Product----' + item.productId);
    }
  }
}
