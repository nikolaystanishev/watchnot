import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, ScrollView, Text } from 'react-native';
import { Avatar, Card, Chip } from 'react-native-elements';
import { FlatList } from 'react-native-gesture-handler';

import { useNavigation } from '@react-navigation/native';

import { getWatchable } from 'imdb-crawler-api';
import { getWatchableSeasonEpisodes, SimiliarWatchable, Watchable, WatchableActor, WatchableEpisode } from 'imdb-crawler-api/src/watchable';

import { TextColorTheme } from './common/text-color-theme';

import { useDatabaseConnection } from '../db/connection';

import { createArrayFromSize } from '../utils/utils';

import { LoaderAnimation } from './common/loader-animation';
import { cardStyles, colorStyles, numberCardStyles } from './common-styles/styles';
import { ScreenAnimatedLoader } from './common/loader-screen';


export function WatchableScreen(props: { route: { params: { id: string } } }) {
  const navigation = useNavigation();
  const { seriesSubscriptionRepository } = useDatabaseConnection();

  const [dbLoad, setDbLoad] = useState<boolean>(false);
  const [watchable, setWatchable] = useState<Watchable | null>(null);
  const [stars, setStars] = useState<WatchableActor[] | null>([]);
  const [hasSubscription, setHasSubscription] = useState<boolean>(false);

  useEffect(() => {
    if (watchable != null && watchable.id && !dbLoad) {
      setDbLoad(true);
      seriesSubscriptionRepository.hasSubscription(watchable.id).then((active: boolean) => {
        setHasSubscription(active);
        setDbLoad(false);
      });
    }
  }, [watchable]);

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

  const subscribe = async () => {
    if (dbLoad) {
      subscribe();
      return;
    }
    if (watchable != null && watchable.id) {
      setDbLoad(true);
      seriesSubscriptionRepository.changeActiveStatus(watchable?.id, watchable.title).then((active: boolean) => {
        setHasSubscription(active);
        setDbLoad(false);
      });
    }
  }

  return (
    <>
      <LoaderAnimation fetchData={fetchData} isReady={(watchable != null) && !dbLoad} loaderComponent={ScreenAnimatedLoader} />
      <ScrollView>
        <Card containerStyle={cardStyles.card} >
          {watchable && watchable.episodeCount.seasons &&
            <Chip
              title={<Text style={hasSubscription ? colorStyles.whiteColor : colorStyles.mainColor}>New Episodes Subscribe</Text>}
              type={hasSubscription ? 'solid' : 'outline'}
              onPress={subscribe}
              buttonStyle={hasSubscription ? colorStyles.mainBackgroundColor : colorStyles.mainBorderColor}
            />
          }
          <View style={cardStyles.poster}>
            <Avatar
              rounded
              size='xlarge'
              source={{ uri: watchable?.poster }}
              onPress={openImage}
            />
          </View>
          <Card.Divider />
          <Card.Title>{watchable?.title}</Card.Title>
          <View style={cardStyles.centerText}>
            <Card.FeaturedTitle>
              <TextColorTheme text={`${watchable?.year} - ${watchable?.rating}`} />
            </Card.FeaturedTitle>
          </View>
          <Card.FeaturedSubtitle><TextColorTheme text={watchable?.story} /></Card.FeaturedSubtitle>
          {watchable && watchable.episodeCount.seasons && <SeriesEpisodes watchable={watchable} />}
          <Card.Divider />
          <View style={cardStyles.centerText}>
            <Card.FeaturedTitle><TextColorTheme text="Actors" /></Card.FeaturedTitle>
          </View>
          <FlatList
            horizontal
            data={stars}
            renderItem={({ item }) => <MemodActorCard key={item.id} actor={item} />}
            showsHorizontalScrollIndicator={false}
          />
          <View style={cardStyles.centerText}>
            <Card.FeaturedTitle><TextColorTheme text="Similiar Titles" /></Card.FeaturedTitle>
          </View>
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
            size='xlarge'
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
            size='xlarge'
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
      <View style={cardStyles.centerText}>
        <Card.FeaturedSubtitle><TextColorTheme text="Seasons" /></Card.FeaturedSubtitle>
      </View>
      <FlatList
        horizontal
        data={createArrayFromSize(props.watchable.episodeCount['seasons'])}
        renderItem={({ item }) => <NumberCard key={props.watchable.id + "season" + item} value={item} selector={selectSeason} />}
        showsHorizontalScrollIndicator={false}
      />
      <View style={cardStyles.centerText}>
        <Card.FeaturedSubtitle><TextColorTheme text="Episodes" /></Card.FeaturedSubtitle>
      </View>
      <FlatList
        horizontal
        data={createArrayFromSize(seasonEpisodes.length)}
        renderItem={({ item }) => <NumberCard key={props.watchable.id + season + "episode" + item} value={item} selector={selectEpisode} />}
        showsHorizontalScrollIndicator={false}
      />
      {episode != -1 && <MemodEpisodeCard episode={seasonEpisodes[episode]} />}
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
          size='xlarge'
          source={{ uri: props.episode.poster }}
          onPress={openImage}
        />
      </View>
      <Card.Divider />
      <Card.Title>{props.episode.name}</Card.Title>
      <View style={cardStyles.centerText}>
        <Card.FeaturedTitle>
          <TextColorTheme text={`${props.episode.airDateString} - ${props.episode.rating}`} />
        </Card.FeaturedTitle>
      </View>
      <Card.FeaturedSubtitle><TextColorTheme text={props.episode.story} /></Card.FeaturedSubtitle>
    </Card>
  )
}

const MemodSimiliarWatchableCard = React.memo(
  SimiliarWatchableCard, (prev, next) => prev.similarMovie.id == next.similarMovie.id
);
const MemodActorCard = React.memo(ActorCard, (prev, next) => prev.actor.id == next.actor.id);
const MemodEpisodeCard = React.memo(
  EpisodeCard,
  (prev, next) => prev.episode.season == next.episode.season && prev.episode.episode == next.episode.episode
);

const styles = StyleSheet.create({
  watchableCardItem: {
    width: 150,
    height: 280
  },
  actorCardItem: {
    width: 150,
    height: 200,
    marginBottom: 10
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
