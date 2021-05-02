import { StyleSheet } from 'react-native';

import { mainColor } from './colors';


export const cardStyles = StyleSheet.create({
  card: {
    marginBottom: 15
  },
  poster: {
    alignItems: "center",
    marginVertical: 10
  },
  centerText: {
    alignItems: "center"
  }
});

export const animationStyles = StyleSheet.create({
  lottie: {
    width: 100,
    height: 100
  }
});

export const numberCardStyles = StyleSheet.create({
  card: {
    marginBottom: 15,
    height: 50
  }
});

export const colorStyles = StyleSheet.create({
  mainBackgroundColor: {
    backgroundColor: mainColor
  },
  mainBorderColor: {
    borderColor: mainColor
  },
  mainColor: {
    color: mainColor
  },
  whiteColor: {
    color: "white"
  }
})