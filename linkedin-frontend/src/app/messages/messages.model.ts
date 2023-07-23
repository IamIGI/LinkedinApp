import { User } from '../auth/models/user.model';

export interface UsersListMessageRoom {
  user: User;
  lastMessage: { message: string; date: string };
}
