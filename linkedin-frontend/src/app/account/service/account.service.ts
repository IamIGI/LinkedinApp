import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { UserExperience } from '../models/account.models';
import { EMPTY, catchError } from 'rxjs';

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

  addUserExperience(body: UserExperience, currentJobFlag: boolean) {
    const modifiedBody = {
      ...body,
      skills: modifySkillsField(body.skills),
      startDate: modifyDataField(body.startDate as unknown as Date),
      endDate: currentJobFlag
        ? null
        : modifyDataField(body.endDate as unknown as Date),
    };
    return this.http
      .post<UserExperience>(
        this.userExperienceApi,
        modifiedBody,
        this.httpOptions
      )
      .pipe(
        catchError((err) => {
          console.error(err);
          return EMPTY;
        })
      );

    function modifySkillsField(value: string[] | null): string | null {
      if (!value) return null;
      const result = value.toString();
      if (result === '') return null;
      return result;
    }

    function modifyDataField(value: Date): string {
      return value.toISOString().split('T')[0];
    }
  }

  updateUserExperience(body: UserExperience) {
    return this.http.patch(this.userExperienceApi, body);
  }

  deleteUserExperience(id: number) {
    return this.http.delete(`${this.userExperienceApi}?experienceId=${id}`);
  }
}
