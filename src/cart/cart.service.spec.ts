import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from './cart.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart } from './schema/cart.schema';
import { NotFoundException } from '@nestjs/common';

describe('CartService', () => {
  let service: CartService;
  let cartModel: Model<Cart>;

  const mockCartModel = {
    findOne: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: getModelToken(Cart.name),
          useValue: mockCartModel,
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
    cartModel = module.get<Model<Cart>>(getModelToken(Cart.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addToCart', () => {
    const userId = '507f1f77bcf86cd799439011'; // Valid MongoDB ObjectId
    const productId = new Types.ObjectId();
    const addToCartDto = {
      productId: productId,
      quantity: 2,
      price: 100,
      message: 'Adding item to cart'
    };

    it('should create new cart and add item when cart does not exist', async () => {
      mockCartModel.findOne.mockResolvedValue(null);
      const newCart = {
        userId: new Types.ObjectId(userId),
        items: [{
          productId: addToCartDto.productId,
          quantity: addToCartDto.quantity,
          price: addToCartDto.price,
        }],
        save: jest.fn().mockResolvedValue({
          userId: new Types.ObjectId(userId),
          items: [{
            productId: addToCartDto.productId,
            quantity: addToCartDto.quantity,
            price: addToCartDto.price,
          }],
          calculateTotal: () => addToCartDto.quantity * addToCartDto.price,
        }),
      };
      mockCartModel.create.mockResolvedValue(newCart);

      const result = await service.addToCart(userId, addToCartDto);

      expect(result.message).toBe('Added to cart successfully');
      expect(result.items).toHaveLength(1);
      expect(result.totalPrice).toBe(addToCartDto.quantity * addToCartDto.price);
    });

    it('should update quantity when item already exists in cart', async () => {
      const existingCart = {
        userId: new Types.ObjectId(userId),
        items: [{
          productId: addToCartDto.productId,
          quantity: 1,
          price: addToCartDto.price,
        }],
        save: jest.fn().mockResolvedValue({
          userId: new Types.ObjectId(userId),
          items: [{
            productId: addToCartDto.productId,
            quantity: 3, // 1 + 2
            price: addToCartDto.price,
          }],
          calculateTotal: () => 3 * addToCartDto.price,
        }),
      };
      mockCartModel.findOne.mockResolvedValue(existingCart);

      const result = await service.addToCart(userId, addToCartDto);

      expect(result.message).toBe('Added to cart successfully');
      expect(result.items).toHaveLength(1);
      expect(result.totalPrice).toBe(3 * addToCartDto.price);
    });
  });

  describe('getCart', () => {
    const userId = '507f1f77bcf86cd799439011'; // Valid MongoDB ObjectId

    it('should return empty cart when cart does not exist', async () => {
      mockCartModel.findOne.mockResolvedValue(null);

      const result = await service.getCart(userId);

      expect(result.message).toBe('Cart not found');
      expect(result.items).toHaveLength(0);
      expect(result.totalPrice).toBe(0);
    });

    it('should return cart with items when cart exists', async () => {
      const existingCart = {
        userId: new Types.ObjectId(userId),
        items: [{
          productId: new Types.ObjectId(),
          quantity: 2,
          price: 100,
        }],
        calculateTotal: () => 200,
      };
      mockCartModel.findOne.mockResolvedValue(existingCart);

      const result = await service.getCart(userId);

      expect(result.message).toBe('Cart retrieved successfully');
      expect(result.items).toHaveLength(1);
      expect(result.totalPrice).toBe(200); // 2 * 100
    });
  });

  describe('clearCart', () => {
    const userId = '507f1f77bcf86cd799439011'; // Valid MongoDB ObjectId

    it('should throw NotFoundException when cart does not exist', async () => {
      mockCartModel.findOne.mockResolvedValue(null);

      await expect(service.clearCart(userId)).rejects.toThrow(NotFoundException);
    });

    it('should clear cart items when cart exists', async () => {
      const existingCart = {
        userId: new Types.ObjectId(userId),
        items: [{
          productId: new Types.ObjectId(),
          quantity: 2,
          price: 100,
        }],
        save: jest.fn().mockResolvedValue({
          userId: new Types.ObjectId(userId),
          items: [],
          calculateTotal: () => 0,
        }),
      };
      mockCartModel.findOne.mockResolvedValue(existingCart);

      await service.clearCart(userId);

      expect(existingCart.items).toHaveLength(0);
      expect(existingCart.save).toHaveBeenCalled();
    });
  });
});
