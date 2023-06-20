import { Post } from 'src/app/home/models/Post';

export type Role = 'admin' | 'premium' | 'user';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName?: string | null;
  imagePath?: string | null;
  fullImagePath?: string | null;
  role: Role;
  isPrivateAccount: boolean;
  company?: string | null;
  education?: string | null;
  subscribers?: number | null;
  position?: string | null;
  posts?: Post[];
}
