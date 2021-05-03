import { Connection, Repository } from 'typeorm';

import { NotificationModel } from '../entities/notification-model';
import { SeriesSubscriptionModel } from '../entities/series-subscription-model';


export class NotificationRepository {
  private ormRepository: Repository<NotificationModel>;

  constructor(connection: Connection) {
    this.ormRepository = connection.getRepository(NotificationModel);
  }

  public async getAll(): Promise<NotificationModel[]> {
    return await this.ormRepository.find({
      relations: ['series_subscription']
    });
  }

  public async createOrUpdate(
    series_subscription: SeriesSubscriptionModel, season: string, episode: string, air_date: Date,
    air_date_string: string
  ): Promise<NotificationModel> {
    let notification = await this.ormRepository.findOne({
      series_subscription: series_subscription,
      season: season,
      episode: episode
    });

    if (notification) {
      if (notification.air_date != air_date) {
        notification.air_date = air_date;
        notification.air_date_string = air_date_string;
      }
    } else {
      notification = this.ormRepository.create({
        series_subscription: series_subscription,
        season: season,
        episode: episode,
        air_date: air_date,
        air_date_string: air_date_string
      });
    }

    await this.ormRepository.save(notification);

    return notification;
  }

  public async delete(id: number): Promise<void> {
    await this.ormRepository.delete(id);
  }
}
