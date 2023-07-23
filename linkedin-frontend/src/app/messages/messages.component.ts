import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Observable, Subscription, take } from 'rxjs';
import { ChatService } from './services/chat.service';
import { NgForm } from '@angular/forms';
import { User } from '../auth/models/user.model';
import { usersListMock } from './messages.dictionaries';
import { UsersListMessageRoom } from './messages.model';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.sass'],
})
export class MessagesComponent implements OnInit, OnDestroy {
  @ViewChild('form') form!: NgForm;

  private chatSubscription!: Subscription;

  newMessage$!: Observable<string>;
  messages: string[] = [];

  friends: UsersListMessageRoom[] = usersListMock;

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    //TODO: refactor - unsubscribe
    this.chatSubscription = this.chatService
      .getNewMessage()
      .subscribe((message: string) => {
        this.messages.push(message);
      });

    this.chatService
      .getFriends()
      .pipe(take(1))
      .subscribe((friends: User[]) => {
        console.log(friends);
        // this.friends = friends;
      });
  }

  onSubmit() {
    const { message } = this.form.value;
    if (!message) return;
    this.chatService.sendMessage(message);
    this.form.reset();
  }

  ngOnDestroy(): void {
    this.chatSubscription.unsubscribe();
  }
}
