import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RowItem } from './rowItem';
import { Switch } from 'react-native';

const toggleRowStyle = StyleSheet.create({
  background: {
    backgroundColor: "white",
    width: "100%",
    height:44,
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  text: {
    color: "#FFFFFF",
    fontFamily: 'System',
    fontSize: 17,
  }

});
export class ToggleRowItem extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={{flexDirection: "row"}}>
        <View style={toggleRowStyle.background}>
          <RowItem
            left={<Text style={[toggleRowStyle.text,{color: "#000000"}]}>{this.props.left}</Text>}
            right={<Switch
              value={this.props.value}
              onValueChange={this.props.onValueChange}
              diabled={this.props.disabled}
              trackColor={this.props.trackColor} />}
         />
        </View>
      </View>
    )
  }
}

ToggleRowItem.defaultProps = {
  disabled: false,
  trackColor: {true: "#257EB7"},
}
