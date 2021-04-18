import React, { useState } from 'react';
import { View, Text } from 'react-native';

import { getWatchable } from 'imdb-crawler-api';
import { Watchable } from 'imdb-crawler-api/src/data/objects';

import { LoaderScreen } from './common/loader-screen';


export function WatchableScreen(props: { route: { params: { id: string } } }) {
  const [watchable, setWatchable] = useState<Watchable | null>(null);

  const fetchData = async () => {
    getWatchable(props.route.params.id).then((data: Watchable) => {
      setWatchable(data);
    }).catch(() => {
      console.log('error');
    });
  }

  return (
    <>
      <LoaderScreen fetchData={fetchData} isReady={watchable != null} />
      <View>
        <Text>
          {watchable?.title}
        </Text>
      </View>
    </>
  );
}
