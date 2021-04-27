import React, { useState } from 'react';
import { View, StyleSheet, SectionList, TouchableHighlight, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { Avatar, Card } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

import { getWatchable } from 'imdb-crawler-api';
import { Watchable, SimilarWatchable } from 'imdb-crawler-api/src/data/objects';

import { LoaderScreen } from './common/loader-screen';
import { FlatList } from 'react-native-gesture-handler';


export function WatchableScreen(props: { route: { params: { id: string } } }) {
  const navigation = useNavigation();
  const [watchable, setWatchable] = useState<Watchable | null>(null);

  const fetchData = async () => {
    getWatchable(props.route.params.id).then((data: Watchable) => {
      setWatchable(data);
    }).catch(() => {
      console.log('error');
    });
  }

  const openImage = () => {
    navigation.navigate('Image', { image: watchable?.poster });
  }

  return (
    <>
      <LoaderScreen fetchData={fetchData} isReady={watchable != null} />
      <ScrollView>
        <Card containerStyle={styles.card} >
          <View style={styles.poster}>
            <Avatar
              rounded
              size="xlarge"
              source={{ uri: watchable?.poster }}
              onPress={openImage}
            />
          </View>
          <Card.Divider />
          <Card.Title>{watchable?.title}</Card.Title>
          <View style={styles.centerText}>
            <Card.FeaturedTitle>{watchable?.year} - {watchable?.rating}</Card.FeaturedTitle>
          </View>
          <Card.FeaturedSubtitle>{watchable?.story}</Card.FeaturedSubtitle>
          <Card.Divider />
          <FlatList
            horizontal
            data={watchable?.similarMovies}
            renderItem={({ item }) => <MemodSimilarWatchableCard key={item.id} similarMovie={item} />}
            showsHorizontalScrollIndicator={false}
          />
        </Card>
      </ScrollView>
    </>
  );
}

export function SimilarWatchableCard(props: { similarMovie: SimilarWatchable }) {
  const navigation = useNavigation();

  const openWatchable = () => {
    navigation.push('Watchable', { id: props.similarMovie.id });
  }

  return (
    <>
      <TouchableWithoutFeedback onPress={openWatchable} >
        <Card containerStyle={styles.cardItem}>
          <View style={styles.poster}>
            <Avatar
              rounded
              size="xlarge"
              source={{ uri: props.similarMovie.poster }}
              containerStyle={styles.cardItemPoster}
            />
          </View>
          <Card.Divider />
          <Card.Title>{props.similarMovie.name}</Card.Title>
        </Card>
      </TouchableWithoutFeedback >
    </>
  );
}

const MemodSimilarWatchableCard = React.memo(SimilarWatchableCard, (prev, next) => prev.similarMovie.id == next.similarMovie.id);

const styles = StyleSheet.create({
  card: {
    marginBottom: 15
  },
  poster: {
    alignItems: "center",
    marginBottom: 10
  },
  centerText: {
    alignItems: "center"
  },
  cardItem: {
    width: 150
  },
  cardItemPoster: {
    width: 120,
    height: 120
  }
});
