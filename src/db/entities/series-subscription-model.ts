import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { NotificationModel } from './notification-model';


@Entity('series-subscription-model-3')
export class SeriesSubscriptionModel {
  @PrimaryGeneratedColumn('increment')
  id: number;

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

  @OneToMany(() => NotificationModel, (notification: NotificationModel) => notification.series_subscription, {
    cascade: true
  })
  notifications: NotificationModel[];
}
