import * as Notifications from 'expo-notifications';

import { Connection, Repository } from 'typeorm';

import { NotificationModel } from '../entities/notification-model';
import { SeriesSubscriptionModel } from '../entities/series-subscription-model';


export class NotificationRepository {
  private connection: Connection;
  private ormRepository: Repository<NotificationModel>;

  constructor(connection: Connection) {
    this.connection = connection;
    this.ormRepository = connection.getRepository(NotificationModel);
  }

  public async getAll(): Promise<NotificationModel[]> {
    return await this.ormRepository.find({
      relations: ['series_subscription']
    });
  }

  public async getActiveByWatchableId(watchableId: String): Promise<NotificationModel[]> {
    return (await this.getAll()).filter((notification: NotificationModel) =>
      notification.series_subscription.watchable_id == watchableId && notification.series_subscription.active
    );
  }

  public async createOrUpdate(
    series_subscription: SeriesSubscriptionModel, season: string, episode: string, air_date: Date,
    air_date_string: string
  ): Promise<boolean> {
    let notification = await this.ormRepository.findOne({
      series_subscription_id: series_subscription.id,
      season: season,
      episode: episode
    });

    if (notification) {
      if (notification.air_date != air_date) {
        await this.ormRepository.update(notification.id, { air_date: air_date, air_date_string: air_date_string });
        return true;
      }
      return false;
    } else {
      await this.connection
        .createQueryBuilder()
        .insert()
        .into(NotificationModel)
        .values([
          {
            series_subscription_id: series_subscription.id,
        season: season,
        episode: episode,
        air_date: air_date,
        air_date_string: air_date_string
          }
        ])
        .execute();
      return true;
    }
  }

  public async delete(id: number): Promise<void> {
    await this.ormRepository.delete(id);
  }

  public async deleteAllWhereDateIsLessThanToday(): Promise<void> {
    await this.connection.createQueryBuilder().delete().from(NotificationModel).where('air_date < DATE()').execute();
  }
}
