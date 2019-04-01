import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { RowItem } from './rowItem';
import { RoundedRect } from '../roundedRect';

const moreInfoStyle = StyleSheet.create({
  background: {
    backgroundColor: "transparent",
    width: "100%",
    minHeight:70,
    alignItems: 'center',
    alignSelf: 'stretch',
    paddingTop:10,
    paddingBottom: 10,
  },
  mainLabel: {
    color: "#000000",
    fontFamily: 'System',
    fontSize: 20,
  },
  secondLabel: {
    color: "#8E8E93",
    fontFamily: 'System',
    paddingTop: 3,
    fontSize: 15,
  },
  leftItemStyle: {
    flexDirection: "column",
  },
  rightItemStyle: {
  }

});
export class MoreInfoRowItem extends React.Component {
  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress}>
      <View style={{flexDirection: "row"}}>
        <View style={moreInfoStyle.background}>
          <RowItem
            left={
              <View style={moreInfoStyle.leftItemStyle}>
              <Text numberOfLines={2} ellipsizeMode="tail" style={moreInfoStyle.mainLabel}>{this.props.main}</Text>
              <Text numberOfLines={1} ellipsizeMode="tail" style={moreInfoStyle.secondLabel}>{this.props.second}</Text>
              </View>
            }
            right={this.props.rightItem}
            leftItemStyle={this.props.leftItemStyle}
            rightItemStyle={this.props.rightItemStyle}
            innerBoxStyle={this.props.innerBoxStyle}
         />
        </View>
      </View>
      </TouchableOpacity>
    )
  }
}

MoreInfoRowItem.defaultProps = {
  innerBoxStyle: {
    marginLeft: 20,
    marginRight: 20,
  },
  leftItemStyle: {
    width: "60%"
  },
  rightItemStyle: {
    width: "40%"
  },
}
