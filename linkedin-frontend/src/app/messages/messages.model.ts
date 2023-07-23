import { User } from '../auth/models/user.model';

export interface UsersListMessageRoom {
  user: User;
  lastMessage: { message: string; date: string };
}

export interface ChatHistory {
  userNr: number;
  userName: string;
  profileFullImagePath: string;
  timeSend: string;
  message: string;
}
