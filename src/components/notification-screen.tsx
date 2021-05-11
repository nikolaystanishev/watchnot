import React, { useEffect, useState } from 'react';
import { ListItem } from 'react-native-elements';
import { FlatList } from 'react-native-gesture-handler';

import { useIsFocused, useNavigation } from '@react-navigation/native';

import { useDatabaseConnection } from '../db/connection';

import { newPerSeriesEpisodes } from '../background/new-series-observer';

import { NotificationModel } from '../db/entities/notification-model';

import { LoaderAnimation } from './common/loader-animation';
import { ScreenAnimatedLoader } from './common/loader-screen';


export function NotificationScreen() {
  const { seriesSubscriptionRepository, notificationRepository } = useDatabaseConnection();
  const isFocused = useIsFocused();

  const [isReady, setIsReady] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<NotificationModel[]>([]);

  useEffect(() => {
    if (isFocused) {
      setNotifications([]);
      fetchData();
    }
  }, [isFocused]);

  const fetchData = async () => {
    setIsReady(false);
    await notificationRepository.deleteAllWhereDateIsLessThanToday();

    for (const seriesSubscription of await seriesSubscriptionRepository.getAll()) {
      await newPerSeriesEpisodes(notificationRepository, seriesSubscription);
      const filteredData: NotificationModel[] = [];

      for (const notification of await notificationRepository.getActiveByWatchableId(seriesSubscription.watchable_id)) {
        filteredData.push(notification);
      }

      setNotifications(notifications => [...notifications, ...filteredData]);
    }

    setIsReady(true);
  }

  return (
    <>
      <LoaderAnimation fetchData={() => new Promise(() => { })} isReady={isReady} loaderComponent={ScreenAnimatedLoader} />
      <FlatList
        data={notifications}
        renderItem={({ item }) => <ListElement key={item.id.toString()} notification={item} />}
      />
    </>
  );
}

function ListElement(props: { notification: NotificationModel }) {
  const navigation = useNavigation();

  const openWatchable = () => {
    navigation.navigate('Watchable', { id: props.notification.series_subscription.watchable_id });
  }

  return (
    <ListItem bottomDivider onPress={openWatchable}>
      <ListItem.Content>
        <ListItem.Title>{props.notification.series_subscription.watchable_name}</ListItem.Title>
        <ListItem.Subtitle>S{props.notification.season} - Ep{props.notification.episode}: {props.notification.air_date_string}</ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );
}
