import React, { useState } from "react";
import { FlatList } from "react-native";
import { SearchBar, ListItem, Avatar } from "react-native-elements";

import { getTrending } from 'imdb-crawler-api';
import { Trending } from "imdb-crawler-api/src/data/objects";

import { useIntervalEffect } from "../hooks/use-interval-effect";


export function TrendingScreen() {
  const [search, setSearch] = useState('');
  const [trending, setTrending] = useState<Trending[]>([]);
  const [filter, setFilter] = useState<Trending[]>([]);

  const fetchData = () => {
    getTrending().then((data: Trending[]) => {
      setTrending(data);
      updateSearch(search);
    }).catch(() => {
      setTrending([]);
    });
  }

  useIntervalEffect(fetchData, 1000 * 60 * 5);

  function updateSearch(searchValue?: string) {
    setSearch(searchValue ? searchValue.toLowerCase() : '');
    setFilter(trending.filter((t: Trending) => t.name.toLowerCase().includes(search)));
  };

  return (
    <>
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
