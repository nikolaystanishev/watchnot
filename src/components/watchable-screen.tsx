import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { Avatar, Card } from 'react-native-elements';
import { FlatList } from 'react-native-gesture-handler';

import { useNavigation } from '@react-navigation/native';

import { getWatchable } from 'imdb-crawler-api';
import { getWatchableSeasonEpisodes, SimiliarWatchable, Watchable, WatchableActor, WatchableEpisode } from 'imdb-crawler-api/src/watchable';

import { LoaderAnimation } from './common/loader-animation';
import { cardStyles, numberCardStyles } from './common-styles/styles';
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
          {watchable && watchable.episodeCount && <SeriesEpisodes watchable={watchable} />}
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
  );
}

function ActorCard(props: { actor: WatchableActor }) {
  const navigation = useNavigation();

  const openActor = () => {
    navigation.navigate('Actor', { id: props.actor.id });
  }

  return (
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
  );
}

function SeriesEpisodes(props: { watchable: Watchable }) {
  const [season, setSeason] = useState<string>('0');
  const [episode, setEpisode] = useState<number>(-1);
  const [seasonEpisodes, setSeasonEpisodes] = useState<WatchableEpisode[]>([]);

  const fetchSeasonData = async (season: string) => {
    if (!props.watchable.id) {
      console.log('error');
      return;
    }
    getWatchableSeasonEpisodes(props.watchable.id, season).then((data: WatchableEpisode[]) => {
      setSeasonEpisodes(data);
    }).catch(() => {
      console.log('error');
    });
  }

  useEffect(() => {
    if (season != '0') {
      fetchSeasonData(season);
    }
  }, [season]);

  const selectSeason = (season: string) => {
    setSeason(season);
  }

  const selectEpisode = (episode: string) => {
    setEpisode(Number(episode) - 1);
  }

  return (
    <>
      <Card.Divider />
      <FlatList
        horizontal
        data={Array.from({ length: Number(props.watchable.episodeCount['seasons']) }, (_, i) => (i + 1).toString())}
        renderItem={({ item }) => <NumberCard key={props.watchable.id + item} value={item} selector={selectSeason} />}
        showsHorizontalScrollIndicator={false}
      />
      <FlatList
        horizontal
        data={Array.from({ length: Number(seasonEpisodes.length) }, (_, i) => (i + 1).toString())}
        renderItem={({ item }) => <NumberCard key={props.watchable.id + season + item} value={item} selector={selectEpisode} />}
        showsHorizontalScrollIndicator={false}
      />
      {episode != -1 && <EpisodeCard episode={seasonEpisodes[episode]} />}
    </>
  )
}

function NumberCard(props: { value: string, selector: (value: string) => void }) {
  return (
    <TouchableWithoutFeedback onPress={() => props.selector(props.value)} >
      <Card containerStyle={numberCardStyles.card}>
        <Card.Title>{props.value}</Card.Title>
      </Card>
    </TouchableWithoutFeedback>
  );
}

function EpisodeCard(props: { episode: WatchableEpisode }) {
  const navigation = useNavigation();

  const openImage = () => {
    navigation.navigate('Image', { image: props.episode.poster });
  }

  return (
    <Card containerStyle={cardStyles.card} >
      <View style={cardStyles.poster}>
        <Avatar
          rounded
          size="xlarge"
          source={{ uri: props.episode.poster }}
          onPress={openImage}
        />
      </View>
      <Card.Divider />
      <Card.Title>{props.episode.name}</Card.Title>
      <View style={cardStyles.centerText}>
        <Card.FeaturedTitle>{props.episode.airDate} - {props.episode.rating}</Card.FeaturedTitle>
      </View>
      <Card.FeaturedSubtitle>{props.episode.story}</Card.FeaturedSubtitle>
    </Card>
  )
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
