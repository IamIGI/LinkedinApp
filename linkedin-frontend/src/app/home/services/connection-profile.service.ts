import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { FriendRequest, FriendRequestStatus } from '../models/FriendRequest';
import { User } from 'src/app/auth/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class ConnectionProfileService {
  public friendRequests: FriendRequest[] = [];

  private httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) {}

  getConnectionUser(userId: number): Observable<User> {
    return this.http.get<User>(
      `${environment.baseApiUrl}/user/nopost/${userId}`
    );
  }

  getFriendRequestStatus(userId: number): Observable<FriendRequestStatus> {
    return this.http.get<FriendRequestStatus>(
      `${environment.baseApiUrl}/user/friend-request/status/${userId}`
    );
  }

  addConnectionUser(
    userId: number
  ): Observable<FriendRequest | { error: string }> {
    return this.http.post<FriendRequest | { error: string }>(
      `${environment.baseApiUrl}/user/friend-request/send/${userId}`,
      {},
      this.httpOptions
    );
  }

  getFriendRequests(): Observable<FriendRequest[]> {
    return this.http.get<FriendRequest[]>(
      `${environment.baseApiUrl}/user/friend-request/me/received-request`
    );
  }

  removeFriendRequestFromList(friendRequestId: number) {
    const handledFriendRequest: FriendRequest | undefined =
      this.friendRequests.find((friendRequest: FriendRequest) => {
        return friendRequest.id === friendRequestId;
      });

    const unhandledFriendRequest: FriendRequest[] = this.friendRequests.filter(
      (friendRequest: FriendRequest) => {
        return friendRequest.id !== handledFriendRequest!.id;
      }
    );

    this.friendRequests = unhandledFriendRequest;
  }

  respondToFriendRequest(
    requestId: number,
    statusResponse: 'accepted' | 'declined'
  ): Observable<FriendRequest | { error: string }> {
    return this.http.put<FriendRequest>(
      `${environment.baseApiUrl}/user/friend-request/response/${requestId}`,
      { status: statusResponse },
      this.httpOptions
    );
  }

  getNoConnectionUsers(skip: number): Observable<User[]> {
    return this.http.get<User[]>(
      `${environment.baseApiUrl}/user/friend-request/me/no-connection?skip=${skip}`,
      this.httpOptions
    );
  }
}
