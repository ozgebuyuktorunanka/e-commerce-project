import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from './users.service';
import { UserVisitHistoryService } from './services/user-visit-history.service';
import { UserVisitHistory } from './schemas/user-visit-history.schema';
import { BadRequestException } from '@nestjs/common';

/**
 * Test suite for UsersService and UserVisitHistoryService
 * This suite tests the functionality of user visit history tracking
 * including visit recording, history retrieval, and statistics
 */
describe('UsersService', () => {
  let service: UsersService;
  let visitHistoryService: UserVisitHistoryService;
  let userVisitHistoryModel: Model<UserVisitHistory>;

  // Mock MongoDB model with all required methods
  const mockUserVisitHistoryModel = {
    create: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    countDocuments: jest.fn(),
    distinct: jest.fn(),
    deleteMany: jest.fn(),
    exec: jest.fn(),
  };

  /**
   * Setup before each test
   * Creates a fresh instance of the testing module with mocked dependencies
   */
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        UserVisitHistoryService,
        {
          provide: getModelToken(UserVisitHistory.name),
          useValue: mockUserVisitHistoryModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    visitHistoryService = module.get<UserVisitHistoryService>(UserVisitHistoryService);
    userVisitHistoryModel = module.get<Model<UserVisitHistory>>(
      getModelToken(UserVisitHistory.name),
    );
  });

  /**
   * Cleanup after each test
   * Resets all mock functions to their initial state
   */
  afterEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Test suite for UserVisitHistory functionality
   * Tests visit recording, history retrieval, and statistics
   */
  describe('UserVisitHistory', () => {
    // Common test data used across multiple test cases
    const mockUserId = 'user123';
    const mockProductId = 'product123';
    const mockVisitData = {
      userId: mockUserId,
      productId: mockProductId,
      visitedAt: new Date(),
      rating: 4,
    };

    /**
     * Test suite for visit recording functionality
     * Tests various scenarios of recording user visits to products
     */
    describe('addVisit', () => {
      it('should create a new visit record when no recent visit exists', async () => {
        // Setup: Mock no existing visit and successful creation
        mockUserVisitHistoryModel.findOne.mockResolvedValue(null);
        mockUserVisitHistoryModel.create.mockResolvedValue(mockVisitData);
        mockUserVisitHistoryModel.countDocuments.mockResolvedValue(1);

        // Execute: Add a new visit with rating
        await visitHistoryService.addVisit(mockUserId, { productId: mockProductId, rating: 4 });

        // Verify: Check if create was called with correct data
        expect(mockUserVisitHistoryModel.create).toHaveBeenCalledWith({
          userId: mockUserId,
          productId: mockProductId,
          visitedAt: expect.any(Date),
          rating: 4,
        });
      });

      it('should not create a new visit record when a recent visit exists', async () => {
        // Setup: Mock existing recent visit
        mockUserVisitHistoryModel.findOne.mockResolvedValue(mockVisitData);

        // Execute: Attempt to add a visit
        await visitHistoryService.addVisit(mockUserId, { productId: mockProductId });

        // Verify: Ensure no new record was created
        expect(mockUserVisitHistoryModel.create).not.toHaveBeenCalled();
      });

      it('should throw BadRequestException when visit creation fails', async () => {
        // Setup: Mock database error
        mockUserVisitHistoryModel.findOne.mockResolvedValue(null);
        mockUserVisitHistoryModel.create.mockRejectedValue(new Error('Database error'));

        // Execute & Verify: Check if appropriate error is thrown
        await expect(
          visitHistoryService.addVisit(mockUserId, { productId: mockProductId }),
        ).rejects.toThrow(BadRequestException);
      });
    });

    /**
     * Test suite for visit history retrieval
     * Tests fetching user visit history with various filters
     */
    describe('getUserVisitHistory', () => {
      const mockVisits = [mockVisitData];

      it('should return user visit history with default limit', async () => {
        // Setup: Mock successful history retrieval
        mockUserVisitHistoryModel.find.mockReturnValue({
          sort: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValue(mockVisits),
            }),
          }),
        });

        // Execute: Get visit history
        const result = await visitHistoryService.getUserVisitHistory(mockUserId);

        // Verify: Check returned data and query parameters
        expect(result).toEqual(mockVisits);
        expect(mockUserVisitHistoryModel.find).toHaveBeenCalledWith(
          { userId: mockUserId },
          {},
          { limit: 100 },
        );
      });

      it('should return filtered visit history with date range', async () => {
        // Setup: Define date range and mock response
        const startDate = new Date('2024-03-01');
        const endDate = new Date('2024-03-05');
        const query = { startDate, endDate, limit: 10 };

        mockUserVisitHistoryModel.find.mockReturnValue({
          sort: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValue(mockVisits),
            }),
          }),
        });

        // Execute: Get filtered history
        await visitHistoryService.getUserVisitHistory(mockUserId, query);

        // Verify: Check if correct date range filter was applied
        expect(mockUserVisitHistoryModel.find).toHaveBeenCalledWith(
          {
            userId: mockUserId,
            visitedAt: {
              $gte: startDate,
              $lte: endDate,
            },
          },
          {},
          { limit: 10 },
        );
      });
    });

    /**
     * Test suite for product visit statistics
     * Tests calculation of visit counts, unique visitors, and ratings
     */
    describe('getProductVisitStats', () => {
      it('should return correct product visit statistics', async () => {
        // Setup: Mock statistics data
        const mockStats = {
          totalVisits: 10,
          uniqueVisitors: ['user1', 'user2'],
          ratings: [{ rating: 4 }, { rating: 5 }],
        };

        mockUserVisitHistoryModel.countDocuments.mockResolvedValue(mockStats.totalVisits);
        mockUserVisitHistoryModel.distinct.mockResolvedValue(mockStats.uniqueVisitors);
        mockUserVisitHistoryModel.find.mockResolvedValue(mockStats.ratings);

        // Execute: Get product statistics
        const result = await visitHistoryService.getProductVisitStats(mockProductId);

        // Verify: Check calculated statistics
        expect(result).toEqual({
          totalVisits: 10,
          uniqueVisitors: 2,
          averageRating: 4.5,
        });
      });

      it('should handle products with no ratings', async () => {
        // Setup: Mock data with no ratings
        mockUserVisitHistoryModel.countDocuments.mockResolvedValue(5);
        mockUserVisitHistoryModel.distinct.mockResolvedValue(['user1', 'user2']);
        mockUserVisitHistoryModel.find.mockResolvedValue([]);

        // Execute: Get statistics for product with no ratings
        const result = await visitHistoryService.getProductVisitStats(mockProductId);

        // Verify: Check default values for products without ratings
        expect(result).toEqual({
          totalVisits: 5,
          uniqueVisitors: 2,
          averageRating: 0,
        });
      });
    });
  });
});
