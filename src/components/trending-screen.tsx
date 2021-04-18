import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { SearchBar, ListItem, Avatar } from "react-native-elements";

import { getTrending } from 'imdb-crawler-api';
import { Trending } from "imdb-crawler-api/src/data/objects";
import { LoaderScreen } from "./common/loader-screen";

import { useIntervalEffect } from "../hooks/use-interval-effect";


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
      <LoaderScreen fetchData={fetchData} isReady={trending.length != 0 && filter.length != 0} />
      <SearchBar
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
  return (
    <ListItem bottomDivider>
      <Avatar source={{ uri: props.trending.poster }} />
      <ListItem.Content>
        <ListItem.Title>{props.trending.name}</ListItem.Title>
        <ListItem.Subtitle>{props.trending.year} - {props.trending.rating}</ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );
}

const MemodListElement = React.memo(ListElement, (prev, next) => prev.trending.id == next.trending.id);
