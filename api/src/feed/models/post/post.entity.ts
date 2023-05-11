import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('feed_post')
export class FeedPostEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  author: string;
  @Column()
  company: string;
  @Column()
  privateAccount: boolean;
  @Column()
  content: string;
  @Column({ default: 0 })
  subscribers: number;
  @Column({ default: 0 })
  likes: number;
  @Column({ default: 0 })
  comments: number;
  @Column({ default: 0 })
  shared: number;

  @CreateDateColumn()
  createdAt: Date;
  @CreateDateColumn()
  updatedAt: Date;
}
