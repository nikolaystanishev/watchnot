import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SeriesSubscriptionModel } from './series-subscription-model';


@Entity('notification-model-3')
export class NotificationModel {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(
    () => SeriesSubscriptionModel, (seriesSubscription: SeriesSubscriptionModel) => seriesSubscription.notifications
  )
  @JoinColumn()
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
