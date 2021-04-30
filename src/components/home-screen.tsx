import React, { useEffect, useState } from 'react';
import { FlatList, TouchableWithoutFeedback, View, StyleSheet } from 'react-native';
import { Avatar, Card, SearchBar } from 'react-native-elements';

import { useNavigation } from '@react-navigation/native';

import { getSearchActor, getSearchWatchable, SearchActor, SearchWatchable } from 'imdb-crawler-api/src/search';

import { cardStyles } from './common-styles/styles';
import { LoaderAnimation } from './common/loader-animation';
import { ComponentAnimatedLoader } from './common/loader-component';


export function HomeScreen() {
  const [watchableReady, setWatchableReady] = useState<boolean>(false);
  const [actorReady, setActorReady] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [watchables, setWatchables] = useState<SearchWatchable[]>([]);
  const [actors, setActors] = useState<SearchActor[]>([]);

  const fetchData = async (searchQuery: string) => {
    getSearchWatchable(searchQuery).then((data: SearchWatchable[]) => {
      setWatchables(data);
    }).catch(() => {
      console.log('error');
    });
    getSearchActor(searchQuery).then((data: SearchActor[]) => {
      setActors(data);
    }).catch(() => {
      console.log('error');
    });
  }

  useEffect(() => {
    setWatchableReady(false);
    setActorReady(false);
    fetchData(search);
  }, [search]);

  useEffect(() => {
    if (watchables.length != 0) {
      setWatchableReady(true);
    }
  }, [JSON.stringify(watchables)]);

  useEffect(() => {
    if (actors.length != 0) {
      setActorReady(true);
    }
  }, [JSON.stringify(actors)]);

  function updateSearch(searchQuery?: string) {
    setSearch(searchQuery ? searchQuery.toLowerCase() : '');
  };

  return (
    <>
      <SearchBar
        placeholder="Search"
        onChangeText={updateSearch}
        onCancel={updateSearch}
        value={search} />
      <View style={cardStyles.centerText}>
        <Card.FeaturedTitle>Titles</Card.FeaturedTitle>
      </View>
      <View style={styles.watchableCardContainer}>
        <LoaderAnimation fetchData={() => { return new Promise(() => { }) }} isReady={watchableReady} loaderComponent={ComponentAnimatedLoader} />
        <FlatList
          horizontal
          data={watchables}
          renderItem={({ item }) => <MemodWatchableCard key={item.id} searchWatchable={item} />}
          showsHorizontalScrollIndicator={false}
        />
      </View>
      <View style={cardStyles.centerText}>
        <Card.FeaturedTitle>Actors</Card.FeaturedTitle>
      </View>
      <View style={styles.actorCardContainer}>
        <LoaderAnimation fetchData={() => { return new Promise(() => { }) }} isReady={actorReady} loaderComponent={ComponentAnimatedLoader} />
        <FlatList
          horizontal
          data={actors}
          renderItem={({ item }) => <MemodActorCard key={item.id} actor={item} />}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </>
  );

}

export function WatchableCard(props: { searchWatchable: SearchWatchable }) {
  const navigation = useNavigation();

  const openWatchable = () => {
    navigation.push('Watchable', { id: props.searchWatchable.id });
  }

  return (
    <>
      <TouchableWithoutFeedback onPress={openWatchable} >
        <Card containerStyle={styles.watchableCardItem}>
          <View style={cardStyles.poster}>
            <Avatar
              rounded
              size="xlarge"
              source={{ uri: props.searchWatchable.poster }}
              containerStyle={styles.watchableCardItemPoster}
            />
          </View>
          <Card.Divider />
          <Card.Title>{props.searchWatchable.name}</Card.Title>
          <View style={cardStyles.centerText}>
            <Card.FeaturedSubtitle>{props.searchWatchable.type}</Card.FeaturedSubtitle>
            <Card.FeaturedSubtitle>{props.searchWatchable.year}</Card.FeaturedSubtitle>
            <Card.FeaturedSubtitle>{props.searchWatchable.part}</Card.FeaturedSubtitle>
          </View>
        </Card>
      </TouchableWithoutFeedback >
    </>
  );
}

export function ActorCard(props: { actor: SearchActor }) {
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

const MemodWatchableCard = React.memo(WatchableCard, (prev, next) => prev.searchWatchable.id == next.searchWatchable.id);
const MemodActorCard = React.memo(ActorCard, (prev, next) => prev.actor.id == next.actor.id);

const styles = StyleSheet.create({
  watchableCardContainer: {
    height: 300,
    marginVertical: 5
  },
  actorCardContainer: {
    height: 200,
    marginVertical: 5
  },
  watchableCardItem: {
    width: 150,
    marginVertical: 5
  },
  actorCardItem: {
    width: 150,
    marginVertical: 5
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
