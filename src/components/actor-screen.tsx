import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Avatar, Card } from 'react-native-elements';

import { useNavigation } from '@react-navigation/native';

import { getActor } from 'imdb-crawler-api';
import { Actor } from 'imdb-crawler-api/src/actor';

import { LoaderAnimation } from './common/loader-animation';
import { cardStyles } from './common-styles/styles';
import { ScreenAnimatedLoader } from './common/loader-screen';


export function ActorScreen(props: { route: { params: { id: string } } }) {
  const navigation = useNavigation();
  const [actor, setActor] = useState<Actor | null>(null);

  const fetchData = async () => {
    getActor(props.route.params.id).then((data: Actor) => {
      setActor(data);
    }).catch(() => {
      console.log('error');
    });
  }

  const openImage = () => {
    navigation.navigate('Image', { image: actor?.image });
  }

  return (
    <>
      <LoaderAnimation fetchData={fetchData} isReady={actor != null} loaderComponent={ScreenAnimatedLoader} />
      <ScrollView>
        <Card containerStyle={cardStyles.card} >
          <View style={cardStyles.poster}>
            <Avatar
              rounded
              size='xlarge'
              source={{ uri: actor?.image }}
              onPress={openImage}
            />
          </View>
          <Card.Divider />
          <Card.Title>{actor?.name}</Card.Title>
          <View style={cardStyles.centerText}>
            <Card.FeaturedTitle>{actor?.birth}</Card.FeaturedTitle>
            <Card.FeaturedTitle>{actor?.bornInfo}</Card.FeaturedTitle>
          </View>
          <Card.FeaturedSubtitle>{actor?.info}</Card.FeaturedSubtitle>
        </Card>
      </ScrollView>
    </>
  );
}
