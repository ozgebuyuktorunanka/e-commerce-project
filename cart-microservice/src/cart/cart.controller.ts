import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CartService } from './cart.service';
import { CART_PATTERNS } from '@common/types/types';
import { CreateCartDto } from '@common/dto/create-cart.dto';
import { UpdateCartDto } from '@common/dto/update-cart.dto'


@Controller()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @MessagePattern({cmd:CART_PATTERNS.Create})
  create(@Payload() createCartDto: CreateCartDto) {
    return this.cartService.create(createCartDto);
  }

  @MessagePattern({cmd:CART_PATTERNS.FindAll})
  findAll() {
    return this.cartService.findAll();
  }

  @MessagePattern({cmd:CART_PATTERNS.FindOne})
  findOne(@Payload() id: number) {
    return this.cartService.findOne(id);
  }

  @MessagePattern({cmd:CART_PATTERNS.Update})
  update(@Payload() updateCartDto: UpdateCartDto) {
    return this.cartService.update(updateCartDto);
  }

  @MessagePattern({cmd:CART_PATTERNS.Remove})
  remove(@Payload() id: number) {
    return this.cartService.remove(id);
  }
}
