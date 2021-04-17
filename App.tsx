import React from 'react';
import { SafeAreaView, StyleSheet, StatusBar } from 'react-native';

import { TrendingPage } from './src/components/trending-page';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <TrendingPage />
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
});