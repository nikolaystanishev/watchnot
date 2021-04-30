import React, { useEffect, useState } from 'react';

import AppLoading from 'expo-app-loading'

import { loader } from '../common-styles/loader';
import { ComponentAnimatedLoader } from './loader-component';
import { ScreenAnimatedLoader } from './loader-screen';
import { animationStyles } from '../common-styles/styles';


export function LoaderAnimation(props: { fetchData: () => Promise<void>, isReady: boolean, loaderComponent: typeof ComponentAnimatedLoader | typeof ScreenAnimatedLoader }) {
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
      <props.loaderComponent
        visible={!stopLoading}
        overlayColor='rgba(255,255,255,0.75)'
        source={loader}
        animationStyle={animationStyles.lottie}
        speed={1}
      />
    </>
  );
}
