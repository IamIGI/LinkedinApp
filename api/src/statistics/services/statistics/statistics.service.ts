import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable, from } from 'rxjs';
import { FriendRequestEntity } from 'src/auth/models/friend-request.entity';
import { FriendRequest } from 'src/auth/models/friend-request.interface';
import { UserEntity } from 'src/auth/models/user.entity';
import { User } from 'src/auth/models/user.class';
import { Repository } from 'typeorm';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FriendRequestEntity)
    private readonly friendRequestRepository: Repository<FriendRequestEntity>,
  ) {}

  getUsersFriendsStatisticsData(
    currentUser: User,
  ): Observable<FriendRequest[]> {
    return from(
      this.friendRequestRepository.find({
        where: [{ creator: currentUser }, { receiver: currentUser }],
        relations: ['creator', 'receiver'],
      }),
    );
  }
}
