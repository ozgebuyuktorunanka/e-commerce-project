import { Inject, Injectable } from '@nestjs/common';
import { CreateCartDto } from '@common/dto/create-cart.dto';
import { UpdateCartDto } from '@common/dto/update-cart.dto'
import { CART_SERVICE } from '@common/constants';
import { ClientProxy } from '@nestjs/microservices';
import { CART_PATTERNS } from '@common/types/types';

@Injectable()
export class CartsService {
  constructor(
    @Inject(CART_SERVICE) private readonly cartMicroservice: ClientProxy,
  ) {}

  create(createCartDto: CreateCartDto) {
    return this.cartMicroservice.send(
      {
        cmd: CART_PATTERNS.Create,
      },
      createCartDto,
    );
  }

  findAll() {
    return this.cartMicroservice.send({ cmd: CART_PATTERNS.FindAll }, {});
  }

  findOne(id: number) {
    return this.cartMicroservice.send({ cmd: CART_PATTERNS.FindOne }, id);
  }

  update(id: number, updateCartDto: UpdateCartDto) {
    return this.cartMicroservice.send(
      { cmd: CART_PATTERNS.Update },
      { id, updateCartDto },
    );
  }

  remove(id: number) {
    return this.cartMicroservice.send(
      { cmd: CART_PATTERNS.Remove},
      id
    )
  }
}
