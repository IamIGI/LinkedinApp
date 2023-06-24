import { Injectable } from '@nestjs/common';
import { Observable, from, map, of, switchMap } from 'rxjs';
import { User } from '../models/user.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../models/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import {
  FriendRequest,
  FriendRequestStatus,
  FriendRequest_Status,
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

  // findUsersWhoAreInNoConnectionToAuthenticatedUser(usersNumber: number): Observable<User[]> {

  // }

  /** Return all users id who are with authenticated user in requests status: 'pending', 'waiting-for-current-user-response', 'accepted', 'declined' */
  getAllUsersWhoAreInConnectionToAuthenticatedUser(
    currentUser: User,
  ): Observable<number[]> {
    return from(
      this.friendRequestRepository.find({
        where: [
          { creator: currentUser, status: 'pending' },
          { creator: currentUser, status: 'waiting-for-current-user-response' },
          { creator: currentUser, status: 'accepted' },
          { creator: currentUser, status: 'declined' },
          { receiver: currentUser, status: 'pending' },
          {
            receiver: currentUser,
            status: 'waiting-for-current-user-response',
          },
          { receiver: currentUser, status: 'accepted' },
          { receiver: currentUser, status: 'declined' },
        ],
        relations: ['creator', 'receiver'],
      }),
    ).pipe(
      map((friendRequests: FriendRequestEntity[]) => {
        type userConnectionHistory = {
          id: number;
          status: FriendRequest_Status;
          user: User;
        };
        let usersConnectionHistory: userConnectionHistory[] = null!;
        usersConnectionHistory = friendRequests.map(
          (friendRequest: FriendRequestEntity) => {
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
          },
        );
        return [1];
      }),
    );
  }

  findUserById(id: number): Observable<User> {
    return from(
      this.userRepository.findOne({ where: { id }, relations: ['feedPosts'] }),
    ).pipe(
      map((user: User) => {
        delete user.password;
        user.profileFullImagePath = this.userProfileImageURL(
          user.profileImagePath,
          user.id,
        );
        return user;
      }),
    );
  }

  findUserByIdWithoutPosts(id: number): Observable<User> {
    return from(this.userRepository.findOne({ where: { id } })).pipe(
      map((user: User) => {
        delete user.password;
        user.profileFullImagePath = this.userProfileImageURL(
          user.profileImagePath,
          user.id,
        );
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

  private userProfileImageURL(imageName: string, userId: number) {
    return `${process.env.BACKEND_URL_DEV}/feed/user/image/profile/${imageName}?userId=${userId}`;
  }
}
