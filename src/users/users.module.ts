import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { UserSchema } from './shemas/user.shema';
import { UserVisitHistory, UserVisitHistorySchema } from './schemas/user-visit-history.schema';
import { UserVisitHistoryService } from './services/user-visit-history.service';
import { UserVisitHistoryController } from './controllers/user-visit-history.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: UserVisitHistory.name, schema: UserVisitHistorySchema },
    ]),
  ],
  controllers: [UsersController, UserVisitHistoryController],
  providers: [UsersService, UserVisitHistoryService],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
