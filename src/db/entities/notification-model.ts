import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SeriesSubscriptionModel } from './series-subscription-model';


@Entity('notification-model')
export class NotificationModel {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  series_subscription_id: string;

  @ManyToOne(() => SeriesSubscriptionModel)
  @JoinColumn({ name: 'series_subscription_id', referencedColumnName: 'id' })
  series_subscription: SeriesSubscriptionModel;

  @Column({
    nullable: true,
  })
  season: string;

  @Column({
    nullable: true,
  })
  episode: string;

  @Column({
    nullable: true,
  })
  air_date: Date;

  @Column({
    nullable: true,
  })
  air_date_string: string;
}
