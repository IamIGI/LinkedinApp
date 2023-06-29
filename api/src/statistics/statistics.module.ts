import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { IsCreatorGuard } from 'src/feed/guards/is-creator.guard';
import { FeedPostEntity } from 'src/feed/models/post/post.entity';
import { FeedService } from 'src/feed/services/feed.service';
import { StatisticsController } from './controllers/statistics/statistics.controller';
import { UserEntity } from 'src/auth/models/user.entity';
import { FriendRequestEntity } from 'src/auth/models/friend-request.entity';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { JwtStrategy } from 'src/auth/guards/jwt.strategy';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { StatisticsService } from './services/statistics/statistics.service';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([FeedPostEntity, UserEntity, FriendRequestEntity]),
  ],
  providers: [
    JwtGuard,
    JwtStrategy,
    RolesGuard,
    FeedService,
    IsCreatorGuard,
    StatisticsService,
  ],
  controllers: [StatisticsController],
})
export class StatisticsModule {}
