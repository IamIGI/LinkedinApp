import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from './role.enum';
import { FeedPostEntity } from 'src/feed/models/post/post.entity';
import { FriendRequestEntity } from './friend-request.entity';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column({ default: null })
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false }) //do not return the password on sql select method
  password: string;

  @Column({ nullable: true })
  profileImagePath: string;

  @Column({ nullable: true })
  backgroundImagePath: string;

  @Column({ type: 'enum', enum: Role, default: Role.PREMIUM }) //change for user later
  role: Role;

  @Column({ default: null })
  company: string;

  @Column({ default: null })
  position: string;

  @Column({ default: null })
  education: string;

  @Column({ default: null })
  subscribers: number;

  @Column()
  isPrivateAccount: boolean;

  @OneToMany(() => FeedPostEntity, (feedPostEntity) => feedPostEntity.author)
  feedPosts: FeedPostEntity[];

  @OneToMany(
    () => FriendRequestEntity,
    (friendRequestEntity) => friendRequestEntity.creator,
  )
  sentFriendRequests: FriendRequestEntity[];

  @OneToMany(
    () => FriendRequestEntity,
    (friendRequestEntity) => friendRequestEntity.receiver,
  )
  receivedFriendRequests: FriendRequestEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
