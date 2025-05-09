import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { Types } from 'mongoose';

describe('CartController', () => {
  let controller: CartController;
  let service: CartService;

  const mockCartService = {
    addToCart: jest.fn(),
    getCart: jest.fn(),
    clearCart: jest.fn(),
    removeFromCart: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [
        {
          provide: CartService,
          useValue: mockCartService,
        },
      ],
    }).compile();

    controller = module.get<CartController>(CartController);
    service = module.get<CartService>(CartService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('addToCart', () => {
    it('should add item to cart', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const addToCartDto = {
        productId: new Types.ObjectId(),
        quantity: 2,
        price: 100,
        message: 'Adding item to cart'
      };
      const expectedResult = {
        message: 'Added to cart successfully',
        items: [{
          productId: addToCartDto.productId,
          quantity: addToCartDto.quantity,
          price: addToCartDto.price,
        }],
        totalPrice: 200,
      };

      mockCartService.addToCart.mockResolvedValue(expectedResult);

      const result = await controller.addToCart({ user: { id: userId } }, addToCartDto);
      expect(result).toBe(expectedResult);
      expect(mockCartService.addToCart).toHaveBeenCalledWith(userId, addToCartDto);
    });
  });

  describe('getCart', () => {
    it('should return user cart', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const expectedResult = {
        message: 'Cart retrieved successfully',
        items: [{
          productId: new Types.ObjectId(),
          quantity: 2,
          price: 100,
        }],
        totalPrice: 200,
      };

      mockCartService.getCart.mockResolvedValue(expectedResult);

      const result = await controller.getCart({ user: { id: userId } });
      expect(result).toBe(expectedResult);
      expect(mockCartService.getCart).toHaveBeenCalledWith(userId);
    });
  });

  describe('clearCart', () => {
    it('should clear user cart', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const expectedResult = {
        message: 'Cart cleared successfully',
        items: [],
        totalPrice: 0,
      };

      mockCartService.clearCart.mockResolvedValue(expectedResult);

      const result = await controller.clearCart({ user: { id: userId } });
      expect(result).toBe(expectedResult);
      expect(mockCartService.clearCart).toHaveBeenCalledWith(userId);
    });
  });
});
