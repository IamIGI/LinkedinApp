import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { FriendRequest } from 'src/auth/models/friend-request.interface';
import { StatisticsService } from 'src/statistics/services/statistics/statistics.service';

@Controller('statistics')
export class StatisticsController {
  constructor(private statisticsService: StatisticsService) {}

  @UseGuards(JwtGuard)
  @Get('friends')
  getUserFriendRequestsStatistics(@Request() req): Observable<FriendRequest[]> {
    const currentUser = req.user;
    return this.statisticsService.getUsersFriendsStatisticsData(currentUser);
  }
}
