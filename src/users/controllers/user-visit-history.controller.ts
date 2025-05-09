import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  UseGuards, 
  Request, 
  Query, 
  Param,
  HttpCode,
  HttpStatus,
  BadRequestException
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UserVisitHistoryService } from '../services/user-visit-history.service';
import { 
  CreateUserVisitHistoryDto, 
  UserVisitHistoryResponseDto,
  VisitHistoryQueryDto 
} from '../dto/user-visit-history.dto';

@ApiTags('User Visit History')
@ApiBearerAuth()
@Controller('user/visits')
@UseGuards(JwtAuthGuard)
export class UserVisitHistoryController {
  constructor(private readonly userVisitHistoryService: UserVisitHistoryService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Record a new product visit' })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Visit recorded successfully' 
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Invalid input data' 
  })
  async addVisit(
    @Request() req,
    @Body() createUserVisitHistoryDto: CreateUserVisitHistoryDto,
  ): Promise<void> {
    try {
      await this.userVisitHistoryService.addVisit(req.user.userId, createUserVisitHistoryDto);
    } catch (error) {
      throw new BadRequestException('Failed to record visit');
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get user visit history' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Returns user visit history',
    type: [UserVisitHistoryResponseDto]
  })
  async getUserVisitHistory(
    @Request() req,
    @Query() query: VisitHistoryQueryDto,
  ): Promise<UserVisitHistoryResponseDto[]> {
    return this.userVisitHistoryService.getUserVisitHistory(req.user.userId, query);
  }

  @Get('product/:productId/stats')
  @ApiOperation({ summary: 'Get product visit statistics' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Returns product visit statistics' 
  })
  async getProductVisitStats(
    @Param('productId') productId: string,
  ): Promise<{
    totalVisits: number;
    averageRating: number;
    uniqueVisitors: number;
  }> {
    return this.userVisitHistoryService.getProductVisitStats(productId);
  }
}


/**
 * 1- Record a visit with rating for test :) 
 *  POST/user/visits
 * {
 * "productId": "product-id",
  "rating": 4  // optional
 * }
 * 2- Get user visit history
 * GET /user/visits?limit=10&startDate=2024-03-01&endDate=2024-03-05
 * 3- Get product visit statistics
 * GET /user/visits/product/:productId/stats
 * 
 * 
 */