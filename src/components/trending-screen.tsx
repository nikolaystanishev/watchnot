import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { SearchBar, ListItem, Avatar } from "react-native-elements";

import { useNavigation } from "@react-navigation/native";


import { getTrending } from 'imdb-crawler-api';
import { Trending } from "imdb-crawler-api/src/trending";

import { LoaderAnimation } from "./common/loader-animation";
import { useIntervalEffect } from "../hooks/use-interval-effect";
import { ScreenAnimatedLoader } from "./common/loader-screen";



export function TrendingScreen() {
  const [search, setSearch] = useState<string>('');
  const [trending, setTrending] = useState<Trending[]>([]);
  const [filter, setFilter] = useState<Trending[]>([]);

  const fetchData = async () => {
    getTrending().then((data: Trending[]) => {
      setTrending(data);
    }).catch(() => {
      console.log('error');
    });
  }

  useIntervalEffect(fetchData, 1000 * 60 * 5);

  useEffect(() => {
    updateSearch(search);
  }, [trending]);

  function updateSearch(searchValue?: string) {
    const searchQuery: string = searchValue ? searchValue.toLowerCase() : '';
    setFilter(trending.filter((t: Trending) => t.name.toLowerCase().includes(searchQuery)));
    setSearch(searchQuery);
  };

  return (
    <>
      <LoaderAnimation fetchData={fetchData} isReady={trending.length != 0 && filter.length != 0} loaderComponent={ScreenAnimatedLoader} />
      <SearchBar
        platform="default"
        placeholder="Search Movies"
        onChangeText={updateSearch}
        onCancel={updateSearch}
        value={search} />
      <FlatList
        data={filter}
        renderItem={({ item }) => <MemodListElement key={item.id} trending={item} />}
      />
    </>
  );
}


function ListElement(props: { trending: Trending }) {
  const navigation = useNavigation();

  const openWatchable = () => {
    navigation.navigate('Watchable', { id: props.trending.id });
  }

  return (
    <ListItem bottomDivider onPress={openWatchable}>
      <Avatar source={{ uri: props.trending.poster }} />
      <ListItem.Content>
        <ListItem.Title>{props.trending.name}</ListItem.Title>
        <ListItem.Subtitle>{props.trending.year} - {props.trending.rating}</ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );
}

const MemodListElement = React.memo(ListElement, (prev, next) => prev.trending.id == next.trending.id);
