import { User } from 'src/auth/models/user.class';

export interface UserExperience {
  id?: number;
  user?: User;
  startDate: string;
  endDate: string | null;
  companyName: string;
  position: string;
  localization: string;
  description: string | null;
  skills: string | null;
  formOfEmployment:
    | 'full'
    | 'partly'
    | 'selfEmployment'
    | 'internship'
    | 'practice'
    | 'seasonWork'
    | 'mandateContract';
}

export type UserExperienceReturnData = Omit<UserExperience, 'skills'> & {
  skills: string[] | null;
};
