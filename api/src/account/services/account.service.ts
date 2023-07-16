import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { userExperienceEntity } from '../models/userExperience.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { User } from 'src/auth/models/user.class';
import { Observable, from, map, switchMap } from 'rxjs';
import {
  UserExperience,
  UserExperienceReturnData,
} from '../models/userExperience.model';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(userExperienceEntity)
    private readonly userExperienceRepository: Repository<userExperienceEntity>,
  ) {}

  getUserExperience(user: User): Observable<UserExperienceReturnData[]> {
    return from(
      this.userExperienceRepository.find({
        where: { user },
        order: { startDate: 'DESC' },
      }),
    ).pipe(
      map((userExperiences: UserExperience[]) => {
        return userExperiences.map((experience) => {
          return {
            ...experience,
            skills: experience.skills && experience.skills.split(','),
          };
        });
      }),
    );
  }

  addUserExperience(
    experience: UserExperience,
    user: User,
  ): Observable<UserExperienceReturnData> {
    const objectToSave = { ...experience, user };
    return from(this.userExperienceRepository.save(objectToSave)).pipe(
      map((experience: UserExperience) => {
        return {
          ...experience,
          skills: experience.skills && experience.skills.split(','),
        };
      }),
    );
  }

  //user get whole object on frontend,and return it with corrected fields
  updateUserExperience(
    updatedExperience: UserExperience,
  ): Observable<UpdateResult> {
    return from(
      this.userExperienceRepository.update(
        { id: updatedExperience.id },
        updatedExperience,
      ),
    );
  }

  deleteUserExperience(id: number): Observable<DeleteResult> {
    return from(this.userExperienceRepository.delete(id));
  }
}
