import { User } from './user.interface';

export type FriendRequest_Status =
  | 'not-sent'
  | 'pending'
  | 'waiting-for-current-user-response'
  | 'accepted'
  | 'declined';

export interface FriendRequestStatus {
  id: number;
  status?: FriendRequest_Status;
}

export interface FriendRequest {
  id?: number;
  creator?: User;
  receiver?: User;
  status: FriendRequest_Status;
  sendedDate?: Date;
  repliedDate?: Date;
}

export interface UserConnectionHistory {
  id: number;
  status: FriendRequest_Status;
  user: User;
}
