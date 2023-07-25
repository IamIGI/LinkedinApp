import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/auth/models/user.model';
import { ChatSocketService } from 'src/app/core/chat-socket.service';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private socket: ChatSocketService, private http: HttpClient) {}

  sendMessage(message: string): void {
    this.socket.emit('sendMessage', message);
  }

  getNewMessage(): Observable<{ message: string }> {
    return this.socket.fromEvent<{ message: string }>('newMessage');
  }

  getFriends(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.baseApiUrl}/user/friends/my`);
  }
}
