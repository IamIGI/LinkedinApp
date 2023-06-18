import { User } from 'src/app/guests/components/auth/models/user.model';

export type FriendRequest_Status =
  | 'not-sent'
  | 'pending'
  | 'waiting-for-current-user-response'
  | 'accepted'
  | 'declined';

export interface FriendRequestStatus {
  status: FriendRequest_Status;
}

export interface FriendRequest {
  id: number;
  creator: User;
  receiver: User;
  status: FriendRequest_Status;
}
