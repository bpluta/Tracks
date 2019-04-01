import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { RowItem } from './rowItem';

const inputRowStyle = StyleSheet.create({
  background: {
    backgroundColor: "white",
    width: "100%",
    height:44,
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  text: {
    color: "#000000",
    fontFamily: 'System',
    fontSize: 17,
    width: "100%",
    textAlign: "right",
  }

});
export class InputRowItem extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={{flexDirection: "row"}}>
        <View style={inputRowStyle.background}>
          <RowItem
            left={<Text style={inputRowStyle.text}>{this.props.left}</Text>}
            right={
              <View style={{minWidth:150 ,paddingLeft:30}}>
              <TextInput numberOfLines={1} ellipsizeMode="tail" secureTextEntry={this.props.secureTextEntry} style={[inputRowStyle.text]} value={this.props.right} onChangeText={this.props.onChangeText} keyboardType={this.props.keyboardType}/>
              </View>
            }
            rightItemStyle={this.props.rightItemStyle}
         />
        </View>
      </View>
    )
  }
}
