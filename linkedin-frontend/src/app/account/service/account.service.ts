import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { UserExperience } from '../models/account.models';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  userExperienceApi = `${environment.baseApiUrl}/account/experience`;
  private httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) {}

  getUserExperience() {
    return this.http.get<UserExperience[]>(
      this.userExperienceApi,
      this.httpOptions
    );
  }

  addUserExperience(body: UserExperience) {
    return this.http.post<UserExperience>(
      this.userExperienceApi,
      body,
      this.httpOptions
    );
  }

  updateUserExperience(body: UserExperience) {
    return this.http.patch(this.userExperienceApi, body);
  }

  deleteUserExperience(id: number) {
    return this.http.delete(`${this.userExperienceApi}?experienceId=${id}`);
  }
}
