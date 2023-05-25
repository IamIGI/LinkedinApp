import { Role } from './role.enum';

export interface User {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  role?: Role;
  isPrivateAccount?: boolean;
  company?: string;
  education?: string;
  subscribers?: number;
}