import { User } from 'src/app/guests/components/auth/models/user.model';

export interface Post {
  id: number;
  author: User;
  content: string;
  likes?: number;
  comments?: number;
  shared?: number;
  createdAt: Date;
  updatedAt: Date;
}
