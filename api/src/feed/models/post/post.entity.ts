import { UserEntity } from 'src/auth/models/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity('feed_post')
export class FeedPostEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (UserEntity) => UserEntity.feedPosts, {
    eager: true,
  })
  author: UserEntity;

  @Column({ default: null })
  imageName: string;

  @Column()
  content: string;

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
