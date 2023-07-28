import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, take } from 'rxjs';
import { ChatService } from './services/chat.service';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Role, User } from '../auth/models/user.model';
import { messageHistoryMock, userFromChatMock } from './messages.dictionaries';
import { ChatHistory, UsersListMessageRoom } from './messages.model';
import { Message } from './models/Messages.interface';
import { Conversation } from './models/Conversation.interface';
import { AuthService } from '../auth/services/auth.service';

const MOCK_USER_DATA = {
  id: 0,
  email: 'email@gmail.com',
  firstName: 'firstName',
  role: 'user' as Role,
  isPrivateAccount: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.sass'],
})
export class MessagesComponent implements OnInit, OnDestroy {
  sendMessageForm!: FormGroup;

  authenticatedUser!: User;

  conservations$!: Observable<Conversation[]>;
  conversations: Conversation[] = [];
  conversation: Conversation | undefined;

  newMessage$!: Observable<string>;
  messages: Message[] = [];

  friends!: User[];
  friend: User | undefined;
  friend$: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(
    null
  );

  selectedConversationIndex: number = 0;

  private userStreamSubscription!: Subscription;
  private friendsSubscription!: Subscription;
  private friendSubscription!: Subscription;
  private conversationSubscription!: Subscription;
  private messagesSubscription!: Subscription;
  private newMessagesSubscription!: Subscription;

  constructor(
    private chatService: ChatService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // console.log(
    //   123,
    //   this.selectedConversationIndex,
    //   this.conversations,
    //   this.conversation,
    //   this.messages,
    //   this.friends,
    //   this.friend
    // );

    this.userStreamSubscription = this.authService.userStream
      .pipe(take(1))
      .subscribe((user: User) => {
        this.authenticatedUser = user;
      });

    this.conversationSubscription = this.chatService
      .getConversations()
      .subscribe((conversations: Conversation[]) => {
        this.conversations.push(conversations[0]); // Note: from mergeMap stream
      });

    this.messagesSubscription = this.chatService
      .getConversationMessages()
      .subscribe((messages: Message[]) => {
        messages.forEach((message: Message) => {
          const allMessageIds = this.messages.map(
            (message: Message) => message.id
          );
          if (!allMessageIds.includes(message.id)) {
            this.messages.push(message);
          }
        });
      });

    this.newMessagesSubscription = this.chatService
      .getNewMessage()
      .subscribe((message: Message) => {
        message.createdAt = new Date(); //TODO: return without seconds

        //TODO: move it to separate function and call for it (repeated)
        const allMessageIds = this.messages.map(
          (message: Message) => message.id
        );
        //double check for the message, so it won't be added twice
        if (!allMessageIds.includes(message.id)) {
          this.messages.push(message);
        }
      });

    this.friendSubscription = this.friend$.subscribe((friend: any) => {
      if (friend !== null) {
        this.chatService.joinConversation(this.friend!.id);
      }
    });

    this.friendsSubscription = this.chatService
      .getFriends()
      .pipe(take(1))
      .subscribe((friends: User[]) => {
        this.friends = friends;

        if (friends.length > 0) {
          //set as an init friend and go to join conservation
          this.friend = this.friends[0];

          this.friend$.next(this.friend);

          friends.forEach((friend: User) => {
            this.chatService.createConversation(friend);
          });

          this.chatService.joinConversation(this.friend.id);
        }
      });

    this.sendMessageForm = new FormGroup({
      message: new FormControl(null, [Validators.required]),
    });
  }

  onSubmit() {
    if (!this.sendMessageForm.valid) return;
    const message = this.sendMessageForm.value.message;

    let conversationUserIds = [
      this.authenticatedUser.id,
      this.friend!.id,
    ].sort();

    this.conversations.forEach((conversation: Conversation) => {
      let userIds = conversation.users?.map((user: User) => user.id).sort();

      if (JSON.stringify(conversationUserIds) === JSON.stringify(userIds)) {
        this.conversation = conversation;
      }
    });
    this.chatService.sendMessage(message, this.conversation!);
    this.sendMessageForm.reset();
  }

  openConversation(friend: User, index: number): void {
    this.selectedConversationIndex = index;

    //leave existing conversation
    this.chatService.leaveConversation();

    this.friend = friend;
    this.friend$.next(this.friend);
    this.messages = [];
  }

  ngOnDestroy(): void {
    this.chatService.leaveConversation();

    this.selectedConversationIndex = 0;
    this.conversations = [];
    this.conversation = undefined;
    this.messages = [];
    this.friends = [];
    this.friend = undefined;

    this.userStreamSubscription.unsubscribe();

    this.conversationSubscription.unsubscribe();
    this.messagesSubscription.unsubscribe();
    this.newMessagesSubscription.unsubscribe();

    this.friendsSubscription.unsubscribe();
    this.friendSubscription.unsubscribe();
  }
}
