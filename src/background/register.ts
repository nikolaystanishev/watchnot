import { useEffect } from 'react';

import * as BackgroundFetch from 'expo-background-fetch';

import { NotificationRepository } from '../db/repositories/notification-repository';
import { SeriesSubscriptionRepository } from '../db/repositories/series-subscription-repository';

import { newSeriesObserverDefine, TASK_NAME } from './new-series-observer';


export const useRegister = (seriesSubscriptionRepository: SeriesSubscriptionRepository, notificationRepository: NotificationRepository, interval: number) => {
  useEffect(() => {
    newSeriesObserverDefine(seriesSubscriptionRepository, notificationRepository);

    try {
      BackgroundFetch.setMinimumIntervalAsync(1);
      BackgroundFetch.registerTaskAsync(TASK_NAME, {
        minimumInterval: interval,
        stopOnTerminate: false,
        startOnBoot: true
      }).then(() => {
        console.log('Task Register');
      })
    } catch (err) {
      console.log('Task Register failed:', err);
    }
  }, []);
}
