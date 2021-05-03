import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';

import { Connection, createConnection } from 'typeorm';

import { NotificationModel } from './entities/notification-model';
import { SeriesSubscriptionModel } from './entities/series-subscription-model';

import { SeriesSubscriptionRepository } from './repositories/series-subscription-repository';
import { NotificationRepository } from './repositories/notification-repository';


interface DatabaseConnectionContextData {
  seriesSubscriptionRepository: SeriesSubscriptionRepository;
  notificationRepository: NotificationRepository;
}

const DatabaseConnectionContext = createContext<DatabaseConnectionContextData>(
  {} as DatabaseConnectionContextData,
);

export const DatabaseConnectionProvider: React.FC = ({ children }) => {
  const [connection, setConnection] = useState<Connection | null>(null);

  const connect = useCallback(async () => {
    const createdConnection = await createConnection({
      type: 'expo',
      database: 'watchnot.db',
      driver: require('expo-sqlite'),
      entities: [SeriesSubscriptionModel, NotificationModel],
      synchronize: true,
    });

    setConnection(createdConnection);
  }, []);


  useEffect(() => {
    if (!connection) {
      connect();
    }
  }, [connect, connection]);

  if (!connection) {
    return <ActivityIndicator />;
  }

  return (
    <DatabaseConnectionContext.Provider
      value={{
        seriesSubscriptionRepository: new SeriesSubscriptionRepository(connection),
        notificationRepository: new NotificationRepository(connection)
      }}
    >
      {children}
    </DatabaseConnectionContext.Provider>
  );
};

export function useDatabaseConnection() {
  const context = useContext(DatabaseConnectionContext);

  return context;
}
