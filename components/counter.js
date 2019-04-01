import React from 'react';
import { View, Text } from 'react-native';
import { getCounterLabel } from '../config/formatData'
import { Style } from '../style';

export class Counter extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View>
        <Text style={this.props.style}>{getCounterLabel(this.props.time)}</Text>
      </View>
    )
  }
}
