import { Connection, Repository } from "typeorm";

import { NotificationModel } from "../entities/notification-model";


export class NotificationRepository {
  private ormRepository: Repository<NotificationModel>;

  constructor(connection: Connection) {
    this.ormRepository = connection.getRepository(NotificationModel);
  }

}
