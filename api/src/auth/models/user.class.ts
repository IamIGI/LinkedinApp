import { IsEmail, IsString } from 'class-validator';
import { Role } from './role.enum';
import { UserNotifications } from './user-notifications.interface';

export class User {
  id?: number;
  firstName?: string;
  lastName?: string;
  @IsEmail()
  email?: string;
  @IsString()
  password?: string;
  profileImagePath?: string;
  profileFullImagePath?: string;
  backgroundImagePath?: string;
  backgroundFullImagePath?: string;
  role?: Role;
  isPrivateAccount?: boolean;
  company?: string;
  education?: string;
  position?: string;
  subscribers?: number;
  userNotifications?: UserNotifications;
  createdAt?: Date;
  updatedAt?: Date;
}
