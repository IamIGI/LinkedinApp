import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from './role.enum';
import { FeedPostEntity } from 'src/feed/models/post/post.entity';

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
  imagePath: string;

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
}
