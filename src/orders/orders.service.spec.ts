import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderService } from './orders.service';
import { Order, OrderStatus } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

/**
 * Test suite for OrderService
 * Tests order management functionality including:
 * - Order creation
 * - Order retrieval
 * - Order status updates
 * - Order validation
 */
describe('OrderService', () => {
  let service: OrderService;
  let orderRepository: Repository<Order>;

  // Mock order repository
  const mockOrderRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  /**
   * Setup before each test
   * Creates fresh instances of services and mocks
   */
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getRepositoryToken(Order),
          useValue: mockOrderRepository,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    orderRepository = module.get<Repository<Order>>(getRepositoryToken(Order));
  });

  /**
   * Cleanup after each test
   * Resets all mock functions
   */
  afterEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Test suite for order creation
   * Tests various order creation scenarios
   */
  describe('create', () => {
    const mockCreateOrderDto: CreateOrderDto = {
      userId: 354,
      productIds: [1],
      shippingAddress: '123 Test St'
    };

    const mockOrder = {
      id: 1,
      ...mockCreateOrderDto,
      status: 'PENDING',
      createdAt: new Date(),
    };

    it('should create a new order successfully', async () => {
      // Setup: Mock repository methods
      mockOrderRepository.create.mockReturnValue(mockOrder);
      mockOrderRepository.save.mockResolvedValue(mockOrder);

      // Execute: Create new order
      const result = await service.create(mockCreateOrderDto);

      // Verify: Check if order was created correctly
      expect(result).toEqual(mockOrder);
      expect(mockOrderRepository.create).toHaveBeenCalledWith({
        ...mockCreateOrderDto,
        status: 'PENDING',
      });
      expect(mockOrderRepository.save).toHaveBeenCalledWith(mockOrder);
    });

    it('should validate order items before creating order', async () => {
      // Setup: Create DTO with invalid items
      const invalidDto = {
        ...mockCreateOrderDto,
        items: [], // Empty items array
      };

      // Execute & Verify: Check if validation error is thrown
      await expect(service.create(invalidDto)).rejects.toThrow(BadRequestException);
    });
  });

  /**
   * Test suite for order retrieval
   * Tests various order fetching scenarios
   */
  describe('findAll', () => {
    const mockOrders = [
      {
        id: 1,
        userId: 123,
        status: 'PENDING',
        items: [{ productId: 1, quantity: 2, price: 100 }],
      },
      {
        id: 2,
        userId: 123,
        status: 'COMPLETED',
        items: [{ productId: 2, quantity: 1, price: 200 }],
      },
    ];

    it('should return all orders', async () => {
      // Setup: Mock repository find method
      mockOrderRepository.find.mockResolvedValue(mockOrders);

      // Execute: Get all orders
      const result = await service.findAll();

      // Verify: Check if correct orders are returned
      expect(result).toEqual(mockOrders);
      expect(mockOrderRepository.find).toHaveBeenCalled();
    });

    it('should return empty array when no orders exist', async () => {
      // Setup: Mock empty result
      mockOrderRepository.find.mockResolvedValue([]);

      // Execute: Get all orders
      const result = await service.findAll();

      // Verify: Check if empty array is returned
      expect(result).toEqual([]);
    });
  });

  /**
   * Test suite for order status updates
   * Tests order status management
   */
  describe('updateStatus', () => {
    const mockOrder = {
      id: 1,
      userId: 123,
      status: 'PENDING',
      items: [{ productId: 1, quantity: 2, price: 100 }],
    };

    it('should update order status successfully', async () => {
      // Setup: Mock repository methods
      mockOrderRepository.findOne.mockResolvedValue(mockOrder);
      mockOrderRepository.update.mockResolvedValue({ affected: 1 });

      // Execute: Update order status
      await service.updateStatus(1, OrderStatus.COMPLETED);

      // Verify: Check if status was updated
      expect(mockOrderRepository.update).toHaveBeenCalledWith(
        1,
        { status: 'COMPLETED' },
      );
    });

    it('should throw NotFoundException when order not found', async () => {
      // Setup: Mock order not found
      mockOrderRepository.findOne.mockResolvedValue(null);

      // Execute & Verify: Check if appropriate error is thrown
      await expect(
        service.updateStatus(999, OrderStatus.COMPLETED),
      ).rejects.toThrow(NotFoundException);
    });

    it('should validate status transitions', async () => {
      // Setup: Mock existing order
      mockOrderRepository.findOne.mockResolvedValue({
        ...mockOrder,
        status: 'COMPLETED',
      });

      // Execute & Verify: Check if invalid status transition is rejected
      await expect(
        service.updateStatus(1, OrderStatus.PENDING),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
