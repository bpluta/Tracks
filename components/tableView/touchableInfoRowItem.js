import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { InfoRowItem } from './infoRowItem';

export class TouchableInfoRowItem extends React.Component {
  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <InfoRowItem {...this.props}/>
      </TouchableOpacity>
    )
  }
}

TouchableInfoRowItem.defaultProps = {
  onPress: (()=> 0),
}
