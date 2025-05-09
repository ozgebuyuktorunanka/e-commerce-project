import { Controller, Get, Post, Put, Delete, Body, UseGuards, Req, Param } from '@nestjs/common';
import { CartService } from './cart.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'auth/jwt/jwt-auth.guard';
import { AddToCartDto, CartResponseDto, UpdateCartDto } from './dto/cart.dto';
import { RequestWithUser } from 'common/interfaces/requestWithUser';


@ApiTags('Cart')
@ApiBearerAuth()
@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
    constructor(private readonly cartService: CartService) { }

    @Post('add')
    @ApiOperation({ summary: 'Add item to cart' })
    @ApiResponse({ status: 201, description: 'Item added to cart successfully', type: CartResponseDto })
    async addToCart(
        @Body() addToCartDto: AddToCartDto,
        @Req() req: RequestWithUser,
    ): Promise<CartResponseDto> {
        return this.cartService.addToCart(req.user.id, addToCartDto);
    }

    @Put('update')
    @ApiOperation({ summary: 'Update cart item quantity' })
    @ApiResponse({ status: 200, description: 'Cart updated successfully', type: CartResponseDto })
    async updateCart(
        @Body() updateCartDto: UpdateCartDto,
        @Req() req: RequestWithUser,
    ): Promise<CartResponseDto> {
        return this.cartService.updateCart(req.user.id, updateCartDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get user cart' })
    @ApiResponse({ status: 200, description: 'Cart retrieved successfully', type: CartResponseDto })
    async getCart(@Req() req: RequestWithUser): Promise<CartResponseDto> {
        return this.cartService.getCart(req.user.id);
    }

    @Delete('clear')
    @ApiOperation({ summary: 'Clear cart' })
    @ApiResponse({ status: 200, description: 'Cart cleared successfully' })
    async clearCart(@Req() req: RequestWithUser): Promise<{ message: string }> {
        await this.cartService.clearCart(req.user.id);
        return { message: 'Cart cleared successfully' };
    }

    @Delete('remove/:productId')
    @ApiOperation({ summary: 'Remove item from cart' })
    @ApiResponse({ status: 200, description: 'Item removed from cart successfully', type: CartResponseDto })
    async removeFromCart(
        @Param('productId') productId: string,
        @Req() req: RequestWithUser,
    ): Promise<CartResponseDto> {
        return this.cartService.removeFromCart(req.user.id, productId);
    }
}

/**
 *  IMPORTANT NOTE: These are test descriptions for each controller method in this cartController.
 @Post('add')
 Description: Sends a POST request to add an item to the authenticated user's cart.
 Sample URL: POST /cart/add
 Sample Body: {
    "productId": "123abc"
    "quantity":  }
Authentication: Bearer token required in the Authorization header.
Expected Response: 201 Created with the updated cart details.
~~~~~~~~~
@Put('update')
Description: Sends a PUT request to update the quantity of an item in the user's cart.
Sample URL: PUT /cart/update
Sample Body:
   "productId": "123abc",
  "quantity": 5
}
Authentication: Bearer token required in the Authorization header.
Expected Response: 200 OK with the updated cart details.
~~~~~~~~~
@Get()
 Description: Retrieves the current cart of the authenticated user.
Sample URL: GET /cart
No request body required.
Authentication: Bearer token required in the Authorization header.
Expected Response: 200 OK with the cart contents.
~~~~~~~~~
@Delete('clear')
Description: Clears all items from the user's cart.
Sample URL: DELETE /cart/clear
No request body required.
Authentication: Bearer token required in the Authorization header.
Expected Response: 200 OK with a success message.
~~~~~~~~~
@Delete('remove/:productId')
Description: Removes a specific item from the user's cart.
Sample URL: DELETE /cart/remove/123abc
No request body required.
Authentication: Bearer token required in the Authorization header.
Expected Response: 200 OK with the updated cart details.
~~~~~~~~~
 */