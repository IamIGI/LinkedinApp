import { User } from 'src/app/account/models/User';

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
