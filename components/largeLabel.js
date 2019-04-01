import React from 'react';
import { Text, StyleSheet } from 'react-native';

export class LargeLabel extends React.Component {
  constructor(props) {
    super(props);
  }

  largeLabelStyle = StyleSheet.create({
    text: {
      fontSize: 34,
      fontWeight: '700',
      fontFamily: 'System',
      flex: 1,
    }
  });

  render() {
    return(
      <Text numberOfLines={2} ellipsizeMode="tail" style={[this.largeLabelStyle.text,this.props.style]}>{this.props.text}</Text>
    )
  }
}
