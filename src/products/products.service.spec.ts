import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

/**
 * Test suite for ProductsService
 * Tests product management functionality including:
 * - Product creation
 * - Product retrieval
 * - Product updates
 * - Product deletion
 * - Product validation
 */
describe('ProductsService', () => {
  let service: ProductsService;
  let productRepository: Repository<Product>;

  // Mock product repository
  const mockProductRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
    })),
  };

  /**
   * Setup before each test
   * Creates fresh instances of services and mocks
   */
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    productRepository = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  /**
   * Cleanup after each test
   * Resets all mock functions
   */
  afterEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Test suite for product creation
   * Tests various product creation scenarios
   */
  describe('create', () => {
    const mockCreateProductDto: CreateProductDto = {
      name: 'Test Product',
      description: 'Test Description',
      price: 99.99,
      stock: 100,
      id: 0,
      store_id: 0,
      category_id: 0,
      rating: 0,
      sell_count: 0,
      images: []
    };

    const mockProduct = {
      ...mockCreateProductDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should create a new product successfully', async () => {
      // Setup: Mock repository methods
      mockProductRepository.create.mockReturnValue(mockProduct);
      mockProductRepository.save.mockResolvedValue(mockProduct);

      // Execute: Create new product
      const result = await service.create(mockCreateProductDto);

      // Verify: Check if product was created correctly
      expect(result).toEqual(mockProduct);
      expect(mockProductRepository.create).toHaveBeenCalledWith(mockCreateProductDto);
      expect(mockProductRepository.save).toHaveBeenCalledWith(mockProduct);
    });

    it('should validate product data before creation', async () => {
      // Setup: Create DTO with invalid data
      const invalidDto = {
        ...mockCreateProductDto,
        price: -10, // Invalid price
      };

      // Execute & Verify: Check if validation error is thrown
      await expect(service.create(invalidDto)).rejects.toThrow(BadRequestException);
    });
  });

  /**
   * Test suite for product retrieval
   * Tests various product fetching scenarios
   */
  describe('findAll', () => {
    const mockProducts = [
      {
        id: 1,
        name: 'Product 1',
        price: 100,
        stock: 50,
      },
      {
        id: 2,
        name: 'Product 2',
        price: 200,
        stock: 30,
      },
    ];

    it('should return all products with default pagination', async () => {
      // Setup: Mock repository find method
      mockProductRepository.find.mockResolvedValue(mockProducts);

      // Execute: Get all products
      const result = await service.findAll(new PaginationQueryDto());

      // Verify: Check if correct products are returned
      expect(result).toEqual(mockProducts);
      expect(mockProductRepository.find).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
      });
    });

    it('should return filtered products by category', async () => {
      // Setup: Mock query builder
      const queryBuilder = mockProductRepository.createQueryBuilder();
      queryBuilder.getMany.mockResolvedValue(mockProducts);

      // Execute: Get products by category
      const result = await service.findAll(new PaginationQueryDto());

      // Verify: Check if correct filter was applied
      expect(result).toEqual(mockProducts);
      expect(queryBuilder.where).toHaveBeenCalled();
    });
  });

  /**
   * Test suite for product updates
   * Tests product update scenarios
   */
  describe('update', () => {
    const mockUpdateProductDto: UpdateProductDto = {
      name: 'Updated Product',
      price: 149.99,
    };

    const mockProduct = {
      id: 1,
      name: 'Original Product',
      price: 99.99,
      stock: 100,
    };

    it('should update product successfully', async () => {
      // Setup: Mock repository methods
      mockProductRepository.findOne.mockResolvedValue(mockProduct);
      mockProductRepository.save.mockResolvedValue({
        ...mockProduct,
        ...mockUpdateProductDto,
      });

      // Execute: Update product
      const result = await service.update(1, mockUpdateProductDto);

      // Verify: Check if product was updated correctly
      expect(result).toEqual({
        ...mockProduct,
        ...mockUpdateProductDto,
      });
      expect(mockProductRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when product not found', async () => {
      // Setup: Mock product not found
      mockProductRepository.findOne.mockResolvedValue(null);

      // Execute & Verify: Check if appropriate error is thrown
      await expect(
        service.update(999, mockUpdateProductDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  /**
   * Test suite for product deletion
   * Tests product deletion scenarios
   */
  describe('remove', () => {
    const mockProduct = {
      id: 1,
      name: 'Test Product',
    };

    it('should delete product successfully', async () => {
      // Setup: Mock repository methods
      mockProductRepository.findOne.mockResolvedValue(mockProduct);
      mockProductRepository.delete.mockResolvedValue({ affected: 1 });

      // Execute: Delete product
      await service.remove(1);

      // Verify: Check if product was deleted
      expect(mockProductRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when product not found', async () => {
      // Setup: Mock product not found
      mockProductRepository.findOne.mockResolvedValue(null);

      // Execute & Verify: Check if appropriate error is thrown
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
