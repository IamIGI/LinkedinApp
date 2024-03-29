import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConversationEntity } from '../models/conversation.entity';
import { ActiveConversationEntity } from '../models/active-conversation.entity';
import { MessageEntity } from '../models/message.entity';
import { Observable, from, map, mergeMap, of, switchMap, take } from 'rxjs';
import { Conversation } from '../models/conversation.interface';
import { DeleteResult, Repository } from 'typeorm';
import { User } from 'src/auth/models/user.class';
import { ActiveConversation } from '../models/active-conversation.interface';
import { Message } from '../models/message.interface';
import { UserService } from 'src/auth/services/user.service';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(ConversationEntity)
    private readonly conversationRepository: Repository<ConversationEntity>,
    @InjectRepository(ActiveConversationEntity)
    private readonly activeConversationRepository: Repository<ActiveConversationEntity>,
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
    private userService: UserService,
  ) {}

  getConversation(
    creatorId: number,
    friendId: number,
  ): Observable<Conversation | undefined> {
    return from(
      this.conversationRepository
        .createQueryBuilder('conversation')
        .leftJoin('conversation.users', 'user')
        .where('user.id = :creatorId', { creatorId })
        .orWhere('user.id = :friendId', { friendId })
        .groupBy('conversation.id')
        .having('COUNT(*) > 1')
        .getOne(),
    ).pipe(map((conversation: Conversation) => conversation || undefined));
  }

  createConversation(creator: User, friend: User): Observable<Conversation> {
    return this.getConversation(creator.id, friend.id).pipe(
      switchMap((conversation: Conversation | undefined) => {
        const doesConversationExist = Boolean(conversation);

        if (!doesConversationExist) {
          const newConversation: Conversation = {
            users: [creator, friend],
          };

          return from(this.conversationRepository.save(newConversation));
        }
        return of(conversation);
      }),
    );
  }

  getConversationsForUser(userId: number): Observable<Conversation[]> {
    return from(
      this.conversationRepository
        .createQueryBuilder('conversation')
        .leftJoin('conversation.users', 'user')
        .where('user.id = :userId', { userId }) /// orWhere not required also?
        .orderBy('conversation.lastUpdated', 'DESC')
        .getMany(),
    );
  }

  getUsersInConversation(conversationId: number): Observable<Conversation[]> {
    return from(
      this.conversationRepository
        .createQueryBuilder('conversation')
        .innerJoinAndSelect('conversation.users', 'user')
        .where('conversation.id = :conversationId', { conversationId })
        .getMany(),
    );
  }

  getConversationsWithUsers(userId: number): Observable<Conversation[]> {
    return this.getConversationsForUser(userId).pipe(
      take(1),
      switchMap((conversations: Conversation[]) => conversations),
      mergeMap((conversation: Conversation) => {
        return this.getUsersInConversation(conversation.id);
      }),
    );
  }

  joinConversation(
    friendId: number,
    userId: number,
    socketId: string,
  ): Observable<ActiveConversation> {
    return this.getConversation(userId, friendId).pipe(
      take(1),
      switchMap((conversation: Conversation) => {
        if (!conversation) {
          console.warn(
            `No conversation exists for userId: ${userId} and friendId: ${friendId}`,
          );
          return of();
        }
        const conversationId = conversation.id;
        return from(
          this.activeConversationRepository.findOne({ where: { userId } }),
        ).pipe(
          switchMap((activeConversation: ActiveConversation) => {
            if (activeConversation) {
              return from(
                this.activeConversationRepository.delete({ userId }), // maybe curly braces needed "{userId}"
              ).pipe(
                switchMap(() => {
                  return from(
                    this.activeConversationRepository.save({
                      socketId,
                      userId,
                      conversationId,
                    }),
                  );
                }),
              );
            } else {
              return from(
                this.activeConversationRepository.save({
                  socketId,
                  userId,
                  conversationId,
                }),
              );
            }
          }),
        );
      }),
    );
  }

  leaveConversation(socketId: string): Observable<DeleteResult> {
    return from(this.activeConversationRepository.delete({ socketId }));
  }

  getActiveUsers(conversationId: number): Observable<ActiveConversation[]> {
    return from(
      this.activeConversationRepository.find({ where: [{ conversationId }] }),
    );
  }

  createMessage(message: Message): Observable<Message> {
    return from(this.messageRepository.save(message)).pipe(
      map((message: Message) => {
        message.user = this.userService.setUserImageData(message.user);
        return message;
      }),
    );
  }

  getMessages(conversationId: number): Observable<Message[]> {
    return from(
      this.messageRepository
        .createQueryBuilder('message')
        .innerJoinAndSelect('message.user', 'user')
        .where('message.conversation.id =:conversationId', { conversationId })
        .orderBy('message.createdAt', 'ASC')
        .getMany(),
    ).pipe(
      map((messages: Message[]) => {
        return messages.map((message: Message) => {
          message.user = this.userService.setUserImageData(message.user);
          return message;
        });
      }),
    );
  }

  // Note: Would remove below in production - helper methods
  removeActiveConversations() {
    return from(
      this.activeConversationRepository.createQueryBuilder().delete().execute(),
    );
  }

  removeMessages() {
    return from(this.messageRepository.createQueryBuilder().delete().execute());
  }

  removeConversations() {
    return from(
      this.conversationRepository.createQueryBuilder().delete().execute(),
    );
  }
}
