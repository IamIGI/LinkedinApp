import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/guests/components/auth/models/user.model';
import { environment } from 'src/environments/environment.development';
import { FriendRequest, FriendRequestStatus } from '../models/FriendRequest';

@Injectable({
  providedIn: 'root',
})
export class ConnectionProfileService {
  public friendRequests: FriendRequest[] = null!;

  private httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) {}

  getConnectionUser(userId: number): Observable<User> {
    return this.http.get<User>(`${environment.baseApiUrl}/user/${userId}`);
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

  respondToFriendRequest(
    requestId: number,
    statusResponse: 'accepted' | 'declined'
  ): Observable<FriendRequest | { error: string }> {
    console.log(requestId, statusResponse);
    return this.http.put<FriendRequest>(
      `${environment.baseApiUrl}/user/friend-request/response/${requestId}`,
      { status: statusResponse },
      this.httpOptions
    );
  }
}
