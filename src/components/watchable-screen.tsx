import React, { useState } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { Avatar, Card } from 'react-native-elements';
import { FlatList } from 'react-native-gesture-handler';

import { useNavigation } from '@react-navigation/native';

import { getWatchable } from 'imdb-crawler-api';
import { SimiliarWatchable, Watchable, WatchableActor } from 'imdb-crawler-api/src/watchable';

import { LoaderScreen } from './common/loader-screen';
import { commonStyles } from './common-styles/styles';


export function WatchableScreen(props: { route: { params: { id: string } } }) {
  const navigation = useNavigation();
  const [watchable, setWatchable] = useState<Watchable | null>(null);
  const [stars, setStars] = useState<WatchableActor[] | null>([]);

  const fetchData = async () => {
    getWatchable(props.route.params.id).then((data: Watchable) => {
      setWatchable(data);
      data.stars.then((starsData: WatchableActor[]) => {
        setStars(starsData);
      });
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
        <Card containerStyle={commonStyles.card} >
          <View style={commonStyles.poster}>
            <Avatar
              rounded
              size="xlarge"
              source={{ uri: watchable?.poster }}
              onPress={openImage}
            />
          </View>
          <Card.Divider />
          <Card.Title>{watchable?.title}</Card.Title>
          <View style={commonStyles.centerText}>
            <Card.FeaturedTitle>{watchable?.year} - {watchable?.rating}</Card.FeaturedTitle>
          </View>
          <Card.FeaturedSubtitle>{watchable?.story}</Card.FeaturedSubtitle>
          <Card.Divider />
          <FlatList
            horizontal
            data={stars}
            renderItem={({ item }) => <MemodActorCard key={item.id} actor={item} />}
            showsHorizontalScrollIndicator={false}
          />
          <FlatList
            horizontal
            data={watchable?.similarMovies}
            renderItem={({ item }) => <MemodSimiliarWatchableCard key={item.id} similarMovie={item} />}
            showsHorizontalScrollIndicator={false}
          />
        </Card>
      </ScrollView>
    </>
  );
}

export function SimiliarWatchableCard(props: { similarMovie: SimiliarWatchable }) {
  const navigation = useNavigation();

  const openWatchable = () => {
    navigation.push('Watchable', { id: props.similarMovie.id });
  }

  return (
    <>
      <TouchableWithoutFeedback onPress={openWatchable} >
        <Card containerStyle={styles.cardItem}>
          <View style={commonStyles.poster}>
            <Avatar
              rounded
              size="xlarge"
              source={{ uri: props.similarMovie.poster }}
              containerStyle={styles.watchableCardItemPoster}
            />
          </View>
          <Card.Divider />
          <Card.Title>{props.similarMovie.name}</Card.Title>
        </Card>
      </TouchableWithoutFeedback >
    </>
  );
}

export function ActorCard(props: { actor: WatchableActor }) {
  const navigation = useNavigation();

  const openActor = () => {
    navigation.navigate('Actor', { id: props.actor.id });
  }

  return (
    <>
      <TouchableWithoutFeedback onPress={openActor} >
        <Card containerStyle={styles.cardItem}>
          <View style={commonStyles.poster}>
            <Avatar
              size="xlarge"
              source={{ uri: props.actor.poster }}
              containerStyle={styles.actorCardItemPoster}
            />
          </View>
          <Card.Divider />
          <Card.Title>{props.actor.name}</Card.Title>
        </Card>
      </TouchableWithoutFeedback >
    </>
  );
}

const MemodSimiliarWatchableCard = React.memo(SimiliarWatchableCard, (prev, next) => prev.similarMovie.id == next.similarMovie.id);
const MemodActorCard = React.memo(ActorCard, (prev, next) => prev.actor.id == next.actor.id);

const styles = StyleSheet.create({
  cardItem: {
    width: 150
  },
  watchableCardItemPoster: {
    width: 120,
    height: 120
  },
  actorCardItemPoster: {
    width: 64,
    height: 88
  }
});
