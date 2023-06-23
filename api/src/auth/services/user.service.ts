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
import { relative } from 'path';
import { UserController } from '../controllers/user.controller';

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
        // console.log(friendRequests);
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
        console.log(usersConnectionHistory);
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
        user.fullImagePath = `${process.env.BACKEND_URL_DEV}/feed/user/image/${user.imagePath}?userId=${user.id}`;
        return user;
      }),
    );
  }

  findUserByIdWithoutPosts(id: number): Observable<User> {
    return from(this.userRepository.findOne({ where: { id } })).pipe(
      map((user: User) => {
        delete user.password;
        user.fullImagePath = `${process.env.BACKEND_URL_DEV}/feed/user/image/${user.imagePath}?userId=${user.id}`;
        return user;
      }),
    );
  }

  updateUserImageById(id: number, imagePath: string): Observable<UpdateResult> {
    const user: User = new UserEntity();
    user.id = id;
    user.imagePath = imagePath;
    return from(this.userRepository.update({ id }, user));
  }

  findImageNameByUserId(id: number): Observable<string> {
    return from(this.userRepository.findOne({ where: { id } })).pipe(
      map((user: User) => {
        delete user.password;
        return user.imagePath;
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

    return this.findUserById(receiverId).pipe(
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
    return this.findUserByIdWithoutPosts(receiverId).pipe(
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
            status: 'waiting-for-current-user-response' as FriendRequest_Status,
          });
        }
        return of({
          id: friendRequest.id,
          status: friendRequest?.status || 'not-sent',
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
    console.log(friendRequestId, statusResponse, currentUser);

    return this.getFriendRequestUserById(friendRequestId).pipe(
      switchMap((friendRequest: FriendRequest) => {
        console.log(friendRequest);
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
}
