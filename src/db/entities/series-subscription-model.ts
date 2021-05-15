import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { NotificationModel } from './notification-model';


@Entity('series-subscription-model')
export class SeriesSubscriptionModel {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    unique: true,
    nullable: false,
  })
  watchable_id: string;

  @Column({
    nullable: false,
  })
  watchable_name: string;

  @Column({
    nullable: false,
    default: true
  })
  active: boolean;
}
