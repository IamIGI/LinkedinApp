import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { FriendRequest_Status } from './friend-request.interface';

@Entity('request')
export class FriendRequestEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // {
  //   eager: true,
  // }
  @ManyToOne(() => UserEntity, (UserEntity) => UserEntity.sentFriendRequests, {
    eager: true,
  })
  creator: UserEntity;

  @ManyToOne(
    () => UserEntity,
    (UserEntity) => UserEntity.receivedFriendRequests,
    {
      eager: true,
    },
  )
  receiver: UserEntity;

  @Column()
  status: FriendRequest_Status;
}
