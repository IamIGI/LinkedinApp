import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatService } from './services/chat.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.sass'],
})
export class MessagesComponent implements OnInit {
  @ViewChild('form') form!: NgForm;

  newMessage$!: Observable<string>;
  messages: string[] = [];

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    //TODO: refactor - unsubscribe
    return this.chatService.getNewMessage().subscribe((message: string) => {
      this.messages.push(message);
    });
  }

  onSubmit() {
    const { message } = this.form.value;
    if (!message) return;
    this.chatService.sendMessage(message);
    this.form.reset();
  }
}
