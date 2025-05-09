import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserVisitHistory } from '../schemas/user-visit-history.schema';
import { CreateUserVisitHistoryDto, VisitHistoryQueryDto } from '../dto/user-visit-history.dto';

@Injectable()
export class UserVisitHistoryService {
  constructor(
    @InjectModel(UserVisitHistory.name)
    private userVisitHistoryModel: Model<UserVisitHistory>,
  ) {}

  async addVisit(userId: string, dto: CreateUserVisitHistoryDto): Promise<void> {
    try {
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

      // Check if there's a recent visit to the same product
      const recentVisit = await this.userVisitHistoryModel.findOne({
        userId,
        productId: dto.productId,
        visitedAt: { $gte: tenMinutesAgo },
      });

      if (!recentVisit) {
        // Create new visit record
        await this.userVisitHistoryModel.create({
          userId,
          productId: dto.productId,
          visitedAt: new Date(),
          rating: dto.rating,
        });

        // Keep only the last 100 records for this user
        await this.cleanupOldRecords(userId);
      }
    } catch (error) {
      throw new BadRequestException('Failed to record visit history');
    }
  }

  async getUserVisitHistory(
    userId: string,
    query: VisitHistoryQueryDto = {},
  ): Promise<UserVisitHistory[]> {
    try {
      const { limit = 100, startDate, endDate } = query;
      
      const queryFilter: any = { userId };
      
      if (startDate || endDate) {
        queryFilter.visitedAt = {};
        if (startDate) queryFilter.visitedAt.$gte = startDate;
        if (endDate) queryFilter.visitedAt.$lte = endDate;
      }

      return this.userVisitHistoryModel
        .find(queryFilter)
        .sort({ visitedAt: -1 })
        .limit(limit)
        .exec();
    } catch (error) {
      throw new BadRequestException('Failed to fetch visit history');
    }
  }

  async getProductVisitStats(productId: string): Promise<{
    totalVisits: number;
    averageRating: number;
    uniqueVisitors: number;
  }> {
    try {
      const [totalVisits, uniqueVisitors, ratings] = await Promise.all([
        this.userVisitHistoryModel.countDocuments({ productId }),
        this.userVisitHistoryModel.distinct('userId', { productId }),
        this.userVisitHistoryModel.find({ productId, rating: { $exists: true } }, 'rating'),
      ]);
      const averageRating = ratings.length > 0
        ? ratings.reduce((acc, curr) => acc + (curr.rating || 0), 0) / ratings.length
        : 0;

      return {
        totalVisits,
        uniqueVisitors: uniqueVisitors.length,
        averageRating: Number(averageRating.toFixed(2)),
      };
    } catch (error) {
      throw new BadRequestException('Failed to fetch product visit statistics');
    }
  }

  private async cleanupOldRecords(userId: string): Promise<void> {
    try {
      const totalRecords = await this.userVisitHistoryModel.countDocuments({ userId });
      if (totalRecords > 100) {
        const recordsToDelete = totalRecords - 100;
        const oldestRecords = await this.userVisitHistoryModel
          .find({ userId })
          .sort({ visitedAt: 1 })
          .limit(recordsToDelete);
        
        if (oldestRecords.length > 0) {
          await this.userVisitHistoryModel.deleteMany({
            _id: { $in: oldestRecords.map(record => record._id) },
          });
        }
      }
    } catch (error) {
      console.error('Failed to cleanup old records:', error);
    }
  }
} 