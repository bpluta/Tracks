import React from 'react';
import { Text, View, StyleSheet, Image, CommonStyles } from 'react-native';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import { HomeScreen } from './home';
import { LoginScreen } from './login';
import { SettingsScreen } from './settings';
import { ClockIcon } from '../icons/clock';
import { ChartIcon } from '../icons/chart';
import { TaskIcon } from '../icons/task';
import { TabNavigator } from '../config/router';
import { LoginStack } from '../config/router';
import { RootNavigator } from '../config/router';

export default createAppContainer(RootNavigator);
