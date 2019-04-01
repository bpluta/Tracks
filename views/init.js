import React from 'react';
import { View, ActivityIndicator, StatusBar, AsyncStorage } from 'react-native';
import { Data } from '../data';
import { login } from '../config/dataFetch';
import { getProject, getTask, getUserData, getRecentWorkTime } from '../demo/dataGateway.js';

export const isDemo = true;

export class InitScreen extends React.Component {
  constructor(props) {
    super(props);
    this.initializeApp();
  }

  initializeApp = async () => {
    AsyncStorage.setItem('IsLogged', "true")
    login({email: "fdudek@example.net"}, (resp) => {
      if (resp.hasOwnProperty('message')){
        this.props.navigation.navigate('Login');
      }
    });

    var isLogged = await AsyncStorage.getItem('IsLogged')

    productToBeSaved = Data.projects;
    await AsyncStorage.setItem("Projects", JSON.stringify(productToBeSaved));

    productToBeSaved = Data.tasks;
    await AsyncStorage.setItem("Tasks", JSON.stringify(productToBeSaved) );

    productToBeSaved = Data.user;
    await AsyncStorage.setItem("User", JSON.stringify(productToBeSaved) );

    this.props.navigation.navigate(isLogged ? 'Main' : 'Login');
  };

  render() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}
