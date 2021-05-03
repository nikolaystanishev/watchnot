import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import Ionicons from '@expo/vector-icons/Ionicons';

import { useRegister } from '../background/register';
import { useIntervalEffect } from '../hooks/use-interval-effect';
import { useDatabaseConnection } from '../db/connection';

import { newSeriesEpisodes } from '../background/new-series-observer';

import { HomeScreen } from './home-screen';
import { TrendingScreen } from './trending-screen';
import { NotificationScreen } from './notification-screen';
import { WatchableScreen } from './watchable-screen';
import { ImageScreen } from './common/image-screen';
import { ActorScreen } from './actor-screen';

import { mainColor, secondaryColor } from './common-styles/colors';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export function Navigation() {
  const { seriesSubscriptionRepository, notificationRepository } = useDatabaseConnection();

  useRegister(seriesSubscriptionRepository, notificationRepository, 60 * 60 * 10);
  useIntervalEffect(newSeriesEpisodes, 1000 * 60 * 10);

  return (
    <SafeAreaView style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name='TabNavigation' component={TabNavigation} options={{ headerShown: false }} />
          <Stack.Screen name='Watchable' component={WatchableScreen} options={{ headerShown: false }} />
          <Stack.Screen name='Actor' component={ActorScreen} options={{ headerShown: false }} />
          <Stack.Screen name='Image' component={ImageScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

function TabNavigation() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const iconName = focused ? icons[route.name] : icons[route.name] + '-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: mainColor,
        inactiveTintColor: secondaryColor,
      }}
    >
      <Tab.Screen name='Home' component={HomeScreen} />
      <Tab.Screen name='Trending' component={TrendingScreen} />
      <Tab.Screen name='Notifications' component={NotificationScreen} />
    </Tab.Navigator>
  )
}


const icons: { [key: string]: string } = {
  'Home': 'home',
  'Trending': 'trending-up',
  'Notifications': 'notifications'
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
});
