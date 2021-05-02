import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';


@Entity('series-subscription')
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
    default: true
  })
  active: boolean;
}
