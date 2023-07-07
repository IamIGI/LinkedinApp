import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { userExperienceEntity } from '../models/userExperience.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { User } from 'src/auth/models/user.class';
import { Observable, from } from 'rxjs';
import { UserExperience } from '../models/userExperience.model';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(userExperienceEntity)
    private readonly userExperienceRepository: Repository<userExperienceEntity>,
  ) {}

  getUserExperience(user: User): Observable<UserExperience[]> {
    return from(
      this.userExperienceRepository.find({
        where: { user },
      }),
    );
  }

  addUserExperience(
    experience: UserExperience,
    user: User,
  ): Observable<UserExperience> {
    const objectToSave = { ...experience, user };
    return from(this.userExperienceRepository.save(objectToSave));
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
