import { Role } from './role.enum';

export interface User {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  imagePath?: string;
  role?: Role;
  isPrivateAccount?: boolean;
  company?: string;
  education?: string;
  position?: string;
  subscribers?: number;
}
