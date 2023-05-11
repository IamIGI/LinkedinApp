export interface FeedPost {
  id?: number;
  author?: string;
  company?: string;
  privateAccount?: boolean;
  subscribers?: number;
  content?: string;
  likes?: number;
  comments?: number;
  shared?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
