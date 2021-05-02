import { Connection, Repository } from "typeorm";

import { SeriesSubscriptionModel } from "../entities/series-subscription-model";


export class SeriesSubscriptionRepository {
  private ormRepository: Repository<SeriesSubscriptionModel>;

  constructor(connection: Connection) {
    this.ormRepository = connection.getRepository(SeriesSubscriptionModel);
  }

}
