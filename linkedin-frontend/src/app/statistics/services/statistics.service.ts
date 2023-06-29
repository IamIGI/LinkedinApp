import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FriendRequest } from 'src/app/home/models/FriendRequest';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  private httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) {}

  getFriendsData() {
    return this.http.get<FriendRequest[]>(
      `${environment.baseApiUrl}/statistics/friends`,
      this.httpOptions
    );
  }
}
