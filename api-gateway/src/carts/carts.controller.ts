import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UseGuards ,Request} from '@nestjs/common';
import { CartsService } from './carts.service';
import { CreateCartDto } from '@common/dto/create-cart.dto';
import { UpdateCartDto } from '@common/dto/update-cart.dto'
import { CacheInterceptor } from '@common/interceptors/cache.interceptor';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { UserResponseDto } from '@common/usersService/dto/userResponse.dto';
import { ParseIntPipe } from '@common/pipes/parse-int.pipe';

@Controller('carts')
@UseInterceptors(CacheInterceptor)
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createCartDto: CreateCartDto, 
    @Request() req) {
    createCartDto.userId = (req.user as UserResponseDto).id;
    return this.cartsService.create(createCartDto);
  }

  @Get()
  findAll() {
    return this.cartsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard) 
  findOne(@Request() req) {
    const userId: number = (req.user as UserResponseDto).id;
    return this.cartsService.findOne(+userId);
  }

  @Patch(':id')
  update(
    @Param('id',ParseIntPipe) id: number, 
    @Body() updateCartDto: UpdateCartDto) 
  {
    return this.cartsService.update(id, updateCartDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.cartsService.remove(+id);
  }
}
