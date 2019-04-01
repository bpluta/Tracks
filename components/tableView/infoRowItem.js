import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RowItem } from './rowItem';

const infoRowStyle = StyleSheet.create({
  background: {
    backgroundColor: "white",
    width: "100%",
    height:44,
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  text: {
    fontFamily: 'System',
    fontSize: 17,
  },
  leftItemText: {
    color: '#000000',
  },
  rightItemText: {
    color: '#8E8E93',
  }
});
export class InfoRowItem extends React.Component {
  render() {
    return (
      <View style={{flexDirection: "row"}}>
        <View style={infoRowStyle.background}>
          <RowItem
            left={<Text style={[infoRowStyle.text,infoRowStyle.leftItemText,this.props.leftLabelStyle]}>{this.props.left}</Text>}
            right={<Text style={[infoRowStyle.text,infoRowStyle.rightItemText,this.props.rightLabelStyle]}>{this.props.right}</Text>}
         />
        </View>
      </View>
    )
  }
}
