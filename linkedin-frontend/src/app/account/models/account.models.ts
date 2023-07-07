import { User } from 'src/app/auth/models/user.model';

export interface UserExperience {
  id?: number;
  user?: User;
  startDate: string;
  endData: string | null;
  companyName: string;
  position: string;
  localization: string;
  description: string | null;
  skills: string | null;
  formOfEmployment: string;
}