import { User } from 'src/app/auth/models/user.model';

export interface UserExperience {
  id?: number;
  user?: User;
  startDate: string;
  endDate: string | null;
  companyName: string;
  position: string;
  localization: string;
  description: string | null;
  skills: string[];
  formOfEmployment: FormOfEmployment;
}

export type FormOfEmployment =
  | 'full'
  | 'partly'
  | 'selfEmployment'
  | 'internship'
  | 'practice'
  | 'seasonWork'
  | 'mandateContract';
