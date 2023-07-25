import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, take } from 'rxjs';
import { ChatService } from './services/chat.service';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { User } from '../auth/models/user.model';
import {
  messageHistoryMock,
  userFromChatMock,
  usersListMock,
} from './messages.dictionaries';
import { ChatHistory, UsersListMessageRoom } from './messages.model';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.sass'],
})
export class MessagesComponent implements OnInit, OnDestroy {
  @ViewChild('form') form!: NgForm;

  sendMessageForm!: FormGroup;

  private chatSubscription!: Subscription;
  private friendsSubscription!: Subscription;
  private messageSubscription!: Subscription;

  newMessage$!: Observable<string>;
  messages: ChatHistory[] = [];

  friends!: UsersListMessageRoom[];
  friend!: User;
  friend$!: BehaviorSubject<User>;

  selectedConversationIndex: number = 0;

  userFromChat: {
    userName: string;
    profileFullImagePath: string;
    position: string;
  } = userFromChatMock;
  messageHistory: ChatHistory[] = messageHistoryMock;

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    console.log(this.messages);
    this.messageSubscription = this.chatSubscription = this.chatService
      .getNewMessage()
      .subscribe((message: { message: string }) => {
        console.log(message);
        const mockMessage = {
          userNr: 1,
          userName: 'Piotr Kowalski',
          profileFullImagePath:
            'http://localhost:3000/api/feed/user/image/profile/c79d625a-0dca-460b-b645-f2804dfecd48.JPG?userId=9',
          timeSend: '11:03',
          message: message.message,
        };
        console.log(mockMessage);
        this.messages.push(mockMessage);
      });

    this.friendsSubscription = this.chatService
      .getFriends()
      .pipe(take(1))
      .subscribe((friends: User[]) => {
        console.log(friends);
        const friendsArray = friends.map((friend) => {
          return {
            user: friend,
            lastMessage: { message: 'Hi Jon, How are you ', date: '21 maj' },
          };
        });
        this.friends = friendsArray;
      });

    this.sendMessageForm = new FormGroup({
      message: new FormControl(null, [Validators.required]),
    });
  }

  onSubmit() {
    if (!this.sendMessageForm.valid) return;
    const message = this.sendMessageForm.value;
    this.chatService.sendMessage(message);
    this.sendMessageForm.reset();
  }

  openConversation(friend: User, index: number): void {
    this.selectedConversationIndex = index;
    console.log(this.selectedConversationIndex);
    this.friend = friend;
    this.friend$.next(this.friend);
  }

  ngOnDestroy(): void {
    this.chatSubscription.unsubscribe();
    this.messageSubscription.unsubscribe();
    this.friendsSubscription.unsubscribe();
  }
}
