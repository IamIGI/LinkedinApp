import { Injectable } from '@nestjs/common';
import {
  Observable,
  forkJoin,
  from,
  map,
  of,
  repeat,
  retry,
  switchMap,
  takeWhile,
  tap,
} from 'rxjs';
import { User } from '../models/user.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../models/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import {
  FriendRequest,
  FriendRequestStatus,
  FriendRequest_Status,
  UserConnectionHistory,
} from '../models/friend-request.interface';
import { FriendRequestEntity } from '../models/friend-request.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FriendRequestEntity)
    private readonly friendRequestRepository: Repository<FriendRequestEntity>,
  ) {}

  private filterUsersForNoConnectionUsers(
    users: User[],
    friends: UserConnectionHistory[],
    authenticatedUser: User,
  ): User[] {
    const ignoreUsers = friends.map((friend) => friend.user.id);
    return users.filter((user) => {
      return !ignoreUsers.includes(user.id) && user.id !== authenticatedUser.id;
    });
  }

  getUsersWhoAreInNoConnectionToAuthenticatedUser(
    skip: number,
    currentUser: User,
  ): Observable<User[]> {
    // TODO: when filtered array result length is < 10 then perform again, until 10 is obtained
    let usersWithNoConnections: User[] = [];

    return forkJoin(
      //TODO: when users will be more ... like 1000, implement random skip value
      this.userRepository.find({
        skip,
        take: 20,
      }),
      this.getAllUsersWhoAreInConnectionToAuthenticatedUser(currentUser),
    ).pipe(
      map(([users, friends]) => {
        usersWithNoConnections.push(
          ...this.filterUsersForNoConnectionUsers(users, friends, currentUser),
        );

        //Users see 8 records, but can remove record from view, so then new one pops in.
        if (usersWithNoConnections.length > 16) {
          return usersWithNoConnections.slice(0, 16);
        }
        users.map((user) => this.setUserImageData(user));
        return usersWithNoConnections;
      }),
      // takeWhile((usersWithNoConnections) => usersWithNoConnections.length < 5),
    );
  }

  getAllUsersWhoAreInConnectionToAuthenticatedUser(
    currentUser: User,
  ): Observable<UserConnectionHistory[]> {
    return from(
      this.friendRequestRepository.find({
        where: [{ creator: currentUser }, { receiver: currentUser }],
        relations: ['creator', 'receiver'],
      }),
    ).pipe(
      map((friendRequests: FriendRequestEntity[]) => {
        return friendRequests.map((friendRequest: FriendRequestEntity) => {
          const targetUser =
            friendRequest.creator.id !== currentUser.id
              ? friendRequest.creator
              : friendRequest.receiver;
          const historyObject = {
            id: friendRequest.id,
            status: friendRequest.status,
            user: targetUser,
          };
          return historyObject;
        });
      }),
    );
  }

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

  findUserById(id: number): Observable<User> {
    return from(
      this.userRepository.findOne({ where: { id }, relations: ['feedPosts'] }),
    ).pipe(
      map((user: User) => {
        delete user.password;
        user = this.setUserImageData(user);
        return user;
      }),
    );
  }

  findUserByIdWithoutPosts(id: number): Observable<User> {
    return from(this.userRepository.findOne({ where: { id } })).pipe(
      map((user: User) => {
        delete user.password;
        user = this.setUserImageData(user);
        return user;
      }),
    );
  }

  getUserEntity(id: number): Observable<User> {
    return from(this.userRepository.findOne({ where: { id } })).pipe(
      map((user: User) => {
        delete user.password;
        return user;
      }),
    );
  }

  updateDBUserImageById(
    id: number,
    imagePath: string,
    imageType: 'profile' | 'background',
  ): Observable<UpdateResult> {
    const user: User = new UserEntity();
    user.id = id;
    switch (imageType) {
      case 'profile':
        user.profileImagePath = imagePath;
        break;
      case 'background':
        user.backgroundImagePath = imagePath;
        break;
      default:
        throw new Error('Bad image type');
    }
    return from(this.userRepository.update({ id }, user));
  }

  findImageNameByUserId(
    id: number,
    imageType: 'profile' | 'background',
  ): Observable<string> {
    return from(this.userRepository.findOne({ where: { id } })).pipe(
      map((user: User) => {
        delete user.password;
        switch (imageType) {
          case 'profile':
            return user.profileImagePath;
          case 'background':
            return user.backgroundImagePath;
          default:
            throw new Error('Bad image type');
        }
      }),
    );
  }

  hasRequestBeenSentOrReceived(
    creator: User,
    receiver: User,
  ): Observable<boolean> {
    return from(
      this.friendRequestRepository.findOne({
        where: [
          { creator, receiver },
          { creator: receiver, receiver: creator },
        ],
      }),
    ).pipe(
      switchMap((friendRequest: FriendRequest) => {
        if (!friendRequest) return of(false);
        return of(true);
      }),
    );
  }

  sendFriendRequest(
    receiverId: number,
    creator: User,
  ): Observable<FriendRequest | { error: string }> {
    if (receiverId === creator.id) {
      return of({
        error: 'You can not invite yourself. CreatorId is equal ReceiverId',
      });
    }

    return this.getUserEntity(receiverId).pipe(
      switchMap((receiver: User) => {
        return this.hasRequestBeenSentOrReceived(creator, receiver).pipe(
          switchMap((hasRequestBeenSentOrReceived: boolean) => {
            if (hasRequestBeenSentOrReceived)
              return of({
                error:
                  'A friend request has already been sent or received to your account!',
              });
            let friendRequest: FriendRequest = {
              creator,
              receiver,
              status: 'pending',
            };
            return from(this.friendRequestRepository.save(friendRequest));
          }),
        );
      }),
    );
  }

  getFriendRequestStatus(
    receiverId: number,
    currentUser: User,
  ): Observable<FriendRequestStatus> {
    return this.getUserEntity(receiverId).pipe(
      switchMap((receiver: User) => {
        return from(
          this.friendRequestRepository.findOne({
            where: [
              { creator: currentUser, receiver: receiver },
              { creator: receiver, receiver: currentUser },
            ],
            relations: ['creator', 'receiver'],
          }),
        );
      }),
      switchMap((friendRequest: FriendRequest) => {
        if (friendRequest) {
          if (
            friendRequest.status === 'accepted' ||
            friendRequest.status === 'declined'
          ) {
            return of({
              id: friendRequest.id,
              status: friendRequest.status,
            });
          }
          if (currentUser.id === friendRequest?.receiver.id) {
            return of({
              id: friendRequest.id,
              status:
                'waiting-for-current-user-response' as FriendRequest_Status,
            });
          }
          return of({
            id: friendRequest.id,
            status: friendRequest?.status || 'not-sent',
          });
        }
        return of({
          id: 0,
          status: 'not-sent' as FriendRequest_Status,
        });
      }),
    );
  }

  getFriendRequestUserById(friendRequestId: number): Observable<FriendRequest> {
    return from(
      this.friendRequestRepository.findOne({
        where: {
          id: friendRequestId,
        },
        relations: ['creator', 'receiver'],
      }),
    );
  }

  respondToFriendRequest(
    friendRequestId: number,
    statusResponse: FriendRequest_Status,
    currentUser: User,
  ): Observable<FriendRequestStatus | { error: string }> {
    return this.getFriendRequestUserById(friendRequestId).pipe(
      switchMap((friendRequest: FriendRequest) => {
        if (friendRequest.creator.id === currentUser.id) {
          return of({ error: 'The user cannot respond to his own invitation' });
        }
        return from(
          this.friendRequestRepository.save({
            ...friendRequest,
            status: statusResponse,
          }),
        );
      }),
    );
  }

  getFriendRequestsFromRecipients(
    currentUser: User,
  ): Observable<FriendRequest[]> {
    return from(
      this.friendRequestRepository.find({
        where: {
          receiver: currentUser,
        },
        relations: ['receiver', 'creator'],
      }),
    );
  }

  private userImageURL(
    imageName: string,
    userId: number,
    imageType: 'profile' | 'background',
  ) {
    return `${process.env.BACKEND_URL_DEV}/feed/user/image/${imageType}/${imageName}?userId=${userId}`;
  }

  private setUserImageData(user: User): User {
    user.profileFullImagePath = this.userImageURL(
      user.profileImagePath,
      user.id,
      'profile',
    );
    user.backgroundFullImagePath = this.userImageURL(
      user.backgroundImagePath,
      user.id,
      'background',
    );
    return user;
  }
}
