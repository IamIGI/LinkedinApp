import { User } from 'src/auth/models/user.interface';

export interface FeedPost {
  id?: number;
  author?: User;
  imageName?: string;
  content?: string;
  likes?: number;
  comments?: number;
  shared?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
