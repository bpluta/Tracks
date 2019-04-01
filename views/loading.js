import React from 'react';
import { View, ActivityIndicator } from 'react-native'

export class LoadingScreen extends React.Component {
  render() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator />
      </View>
    )
  }
}
