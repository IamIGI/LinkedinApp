import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('user_notifications')
export class UserNotificationsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity;

  @Column({ default: false })
  firstTimeHomePage: boolean;

  @Column({ default: false })
  firstTimeAccountPage: boolean;

  @Column({ default: false })
  firstTimeNetworkPage: boolean;

  @Column({ default: false })
  firstTimeStatisticsPage: boolean;
}
