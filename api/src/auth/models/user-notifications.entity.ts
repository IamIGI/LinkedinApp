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

@Entity('userNotifications')
export class UserNotificationsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  firstTimeHomePage: boolean;

  @Column({ default: false })
  firstTimeAccountPage: boolean;

  @Column({ default: false })
  firstTimeNetworkPage: boolean;

  @Column({ default: false })
  firstTimeStatisticsPage: boolean;

  @OneToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity;
}
