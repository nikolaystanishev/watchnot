import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import LottieAnimation from 'lottie-react-native';
import AnimatedLottieView from 'lottie-react-native';

import { loader } from '../common-styles/loader';


export interface LoaderProps {
  visible: boolean;
  overlayColor: string;
  animationType: ['none', 'slide', 'fade'];
  source: string;
  animationStyle: StyleProp<ViewStyle>;
  speed: number;
  loop: boolean;
};


export class ComponentAnimatedLoader extends React.PureComponent<LoaderProps> {
  static defaultProps = {
    visible: false,
    overlayColor: 'rgba(0, 0, 0, 0.25)',
    animationType: 'none',
    source: loader,
    animationStyle: {
      width: 100,
      height: 100
    },
    speed: 1,
    loop: true,
  };

  animation = React.createRef<AnimatedLottieView>();

  componentDidMount() {
    if (this.animation.current) {
      this.animation.current.play();
    }
  }

  componentDidUpdate(prevProps: LoaderProps) {
    const { visible } = this.props;
    if (visible !== prevProps.visible) {
      if (this.animation.current) {
        this.animation.current.play();
      }
    }
  }

  _renderLottie = () => {
    const { source, animationStyle, speed, loop } = this.props;
    return (
      <LottieAnimation
        ref={this.animation}
        source={source}
        loop={loop}
        speed={speed}
        style={[styles.animationStyle, animationStyle]}
      />
    );
  };

  render() {
    const { visible, overlayColor } = this.props;

    if (visible == true) {
      return (
        < View style={[styles.container, { backgroundColor: overlayColor }]} >
          <View>{this._renderLottie()}</View>
          {this.props.children}
        </View >
      );
    }

    return (
      <></>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },
  animationStyle: {
    height: '100%',
    width: '100%',
  },
});
