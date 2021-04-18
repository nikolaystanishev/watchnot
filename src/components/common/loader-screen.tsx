import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

import AppLoading from 'expo-app-loading'
import AnimatedLoader from 'react-native-animated-loader';

import { loader } from '../common-styles/loader';


export function LoaderScreen(props: { fetchData: () => Promise<void>, isReady: boolean }) {
  const [stopLoading, setStopLoading] = useState<boolean>(props.isReady);

  useEffect(() => {
    setStopLoading(props.isReady);
  }, [props.isReady]);


  return (
    <>
      <AppLoading
        startAsync={props.fetchData}
        onFinish={() => { }}
        onError={() => { }} />
      <AnimatedLoader
        visible={!stopLoading}
        overlayColor='rgba(255,255,255,0.75)'
        source={loader}
        animationStyle={styles.lottie}
        speed={1}
      />
    </>
  );
}

const styles = StyleSheet.create({
  lottie: {
    width: 100,
    height: 100
  }
});
