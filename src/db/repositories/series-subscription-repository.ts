import { Connection, Repository } from "typeorm";

import { SeriesSubscriptionModel } from "../entities/series-subscription-model";


export class SeriesSubscriptionRepository {
  private ormRepository: Repository<SeriesSubscriptionModel>;

  constructor(connection: Connection) {
    this.ormRepository = connection.getRepository(SeriesSubscriptionModel);
  }

  public async hasSubscription(watchableId: string): Promise<boolean> {
    const seriesSubscription = await this.ormRepository.findOne({ watchable_id: watchableId });

    return seriesSubscription != undefined && seriesSubscription.active;
  }

  public async create(watchableId: string): Promise<SeriesSubscriptionModel> {
    const seriesSubscription = this.ormRepository.create({
      watchable_id: watchableId
    });

    await this.ormRepository.save(seriesSubscription);

    return seriesSubscription;
  }

  public async changeActiveStatus(watchableId: string): Promise<boolean> {
    let seriesSubscription = await this.ormRepository.findOne({ watchable_id: watchableId });
    if (!seriesSubscription) {
      seriesSubscription = await this.create(watchableId);
      return seriesSubscription.active;
    }

    seriesSubscription.active = !seriesSubscription.active;
    this.ormRepository.save(seriesSubscription);
    return seriesSubscription.active;
  }
}
