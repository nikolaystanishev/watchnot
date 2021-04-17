import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { HomeScreen } from './home-screen';
import { TrendingScreen } from './trending-screen';


const Tab = createBottomTabNavigator();

export function Navigation() {
  return (
    <SafeAreaView style={styles.container}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              const iconName = focused ? icons[route.name] : icons[route.name] + '-outline';
              return <Ionicons name={iconName} size={size} color={color} />;
            },
          })}
          tabBarOptions={{
            activeTintColor: '#7ecde0',
            inactiveTintColor: 'gray',
          }}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Trending" component={TrendingScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}


const icons: { [key: string]: string } = {
  'Home': 'home',
  'Trending': 'trending-up'
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
});

