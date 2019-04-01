import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { RoundedRect } from './roundedRect';

export class RoundedButton extends React.Component {

  constructor(props) {
    super(props);
  }
  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <RoundedRect rectStyle={this.props.rectStyle} textStyle={this.props.textStyle} text={this.props.text} />
      </TouchableOpacity>
    )
  }
}
