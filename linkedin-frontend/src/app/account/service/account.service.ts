import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { UserExperience } from '../models/account.models';
import { EMPTY, Observable, catchError } from 'rxjs';
import { TypeOrmDeleteResponse } from 'src/app/global-models';

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

  addUserExperience(
    body: UserExperience,
    currentJobFlag: boolean
  ): Observable<UserExperience> {
    return this.http
      .post<UserExperience>(
        this.userExperienceApi,
        this.modifiedObjectToSaveExperience(body, currentJobFlag),
        this.httpOptions
      )
      .pipe(
        catchError((err) => {
          console.error(err);
          return EMPTY;
        })
      );
  }

  updateUserExperience(
    body: UserExperience,
    currentJobFlag: boolean
  ): Observable<UserExperience> {
    return this.http.patch<UserExperience>(
      this.userExperienceApi,
      this.modifiedObjectToSaveExperience(body, currentJobFlag)
    );
  }

  deleteUserExperience(id: number) {
    return this.http.delete<TypeOrmDeleteResponse>(
      `${this.userExperienceApi}?experienceId=${id}`
    );
  }

  private modifySkillsField(value: string[] | null): string | null {
    if (!value) return null;
    const result = value.toString();
    if (result === '') return null;
    return result;
  }

  private modifyDataField(value: Date): string {
    return value.toISOString().split('T')[0];
  }

  private modifiedObjectToSaveExperience(
    userExperience: UserExperience,
    currentJobFlag: boolean
  ) {
    return {
      ...userExperience,
      skills: this.modifySkillsField(userExperience.skills),
      startDate: this.modifyDataField(
        userExperience.startDate as unknown as Date
      ),
      endDate: currentJobFlag
        ? null
        : this.modifyDataField(userExperience.endDate as unknown as Date),
    };
  }
}
