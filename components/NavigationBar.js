import React from 'react';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import { HomeScreen } from '../views/home';

const TabNavigator = createBottomTabNavigator({
  Home: { screen: HomeScreen },
});

export default createAppContainer(TabNavigator);
