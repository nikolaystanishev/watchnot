import React, { useState } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { Avatar, Card } from 'react-native-elements';
import { FlatList } from 'react-native-gesture-handler';

import { useNavigation } from '@react-navigation/native';

import { getWatchable } from 'imdb-crawler-api';
import { SimiliarWatchable, Watchable, WatchableActor } from 'imdb-crawler-api/src/watchable';

import { LoaderAnimation } from './common/loader-animation';
import { cardStyles } from './common-styles/styles';
import { ScreenAnimatedLoader } from './common/loader-screen';


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
      <LoaderAnimation fetchData={fetchData} isReady={watchable != null} loaderComponent={ScreenAnimatedLoader} />
      <ScrollView>
        <Card containerStyle={cardStyles.card} >
          <View style={cardStyles.poster}>
            <Avatar
              rounded
              size="xlarge"
              source={{ uri: watchable?.poster }}
              onPress={openImage}
            />
          </View>
          <Card.Divider />
          <Card.Title>{watchable?.title}</Card.Title>
          <View style={cardStyles.centerText}>
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

function SimiliarWatchableCard(props: { similarMovie: SimiliarWatchable }) {
  const navigation = useNavigation();

  const openWatchable = () => {
    navigation.push('Watchable', { id: props.similarMovie.id });
  }

  return (
    <>
      <TouchableWithoutFeedback onPress={openWatchable} >
        <Card containerStyle={styles.watchableCardItem}>
          <View style={cardStyles.poster}>
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

function ActorCard(props: { actor: WatchableActor }) {
  const navigation = useNavigation();

  const openActor = () => {
    navigation.navigate('Actor', { id: props.actor.id });
  }

  return (
    <>
      <TouchableWithoutFeedback onPress={openActor} >
        <Card containerStyle={styles.actorCardItem}>
          <View style={cardStyles.poster}>
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
  watchableCardItem: {
    width: 150,
    height: 280
  },
  actorCardItem: {
    width: 150,
    height: 200
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
