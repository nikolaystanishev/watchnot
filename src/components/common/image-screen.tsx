import React from 'react';
import { StyleSheet } from 'react-native';
import { Image } from 'react-native-elements';

export function ImageScreen(props: { route: { params: { image: string } } }) {

  return (
    <Image
      source={{ uri: props.route.params.image }}
      style={styles.poster}
    />
  );
}

const styles = StyleSheet.create({
  poster: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  }
});