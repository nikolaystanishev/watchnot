import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { SeriesSubscriptionModel } from "./series-subscription-model";


@Entity('notification')
export class NotificationModel {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @OneToOne(() => SeriesSubscriptionModel)
  @JoinColumn()
  series_subscription: SeriesSubscriptionModel;

  @Column({
    unique: true,
    nullable: true,
  })
  season: string;

  @Column({
    unique: true,
    nullable: true,
  })
  episode: string;

  @Column({
    unique: true,
    nullable: true,
  })
  air_date: string;
}
