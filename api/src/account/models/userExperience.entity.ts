import { timeStamp } from 'console';
import { UserEntity } from 'src/auth/models/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('user_experience')
export class userExperienceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity;

  @Column({ type: 'date', nullable: false })
  startDate: string;

  @Column({ type: 'date', default: null, nullable: true })
  endDate: string | null;

  @Column({ nullable: false })
  companyName: string;

  @Column({ nullable: false })
  position: string;

  @Column({ nullable: false })
  localization: string;

  @Column({ default: null })
  description: string | null;

  @Column({ nullable: false })
  skills: string;

  @Column({ nullable: false })
  formOfEmployment:
    | 'full'
    | 'partly'
    | 'selfEmployment'
    | 'internship'
    | 'practice'
    | 'seasonWork'
    | 'mandateContract';
}
