import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';

import { getWatchable } from 'imdb-crawler-api';
import { getWatchableSeasonEpisodes } from 'imdb-crawler-api/src/watchable';
import { SeriesSubscriptionModel } from '../db/entities/series-subscription-model';

import { NotificationRepository } from '../db/repositories/notification-repository';
import { SeriesSubscriptionRepository } from '../db/repositories/series-subscription-repository';

import { createArrayFromSize } from '../utils/utils';


export const TASK_NAME = 'NEW_SERIES_EPISODES';

export const newSeriesObserverDefine = (seriesSubscriptionRepository: SeriesSubscriptionRepository, notificationRepository: NotificationRepository) => {
  TaskManager.defineTask(TASK_NAME, async () => {
    try {
      return (await newSeriesEpisodes(seriesSubscriptionRepository, notificationRepository))
        ? BackgroundFetch.Result.NewData
        : BackgroundFetch.Result.NoData
    } catch (err) {
      return BackgroundFetch.Result.Failed
    }
  });
}

export const newSeriesEpisodes = async (seriesSubscriptionRepository: SeriesSubscriptionRepository, notificationRepository: NotificationRepository): Promise<boolean> => {
  console.log('background scan');
  let newData: boolean = false;

  for (const seriesSubscription of await seriesSubscriptionRepository.getAll()) {
    if (seriesSubscription.active) {
      const result = await newWatchableSeriesEpisodes(seriesSubscription, notificationRepository);
      newData = newData || result;
    }
  }

  return newData;
}

const newWatchableSeriesEpisodes = async (seriesSubscription: SeriesSubscriptionModel, notificationRepository: NotificationRepository): Promise<boolean> => {
  let newData: boolean = false;

  const watchable = await getWatchable(seriesSubscription.watchable_id);
  for (const season of createArrayFromSize(watchable.episodeCount['seasons']).reverse()) {
    for (const episode of (await getWatchableSeasonEpisodes(seriesSubscription.watchable_id, season)).reverse()) {
      if (episode.airDate) {
        if (episode.airDate > new Date()) {
          await notificationRepository.createOrUpdate(seriesSubscription, episode.season, episode.episode, episode.airDate, episode.airDateString);
          newData = true;
        } else {
          return newData;
        }
      }
    }
  }

  return newData;
}