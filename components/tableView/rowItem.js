import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const rowItemStyle = StyleSheet.create({
  box: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "space-between",
    flexDirection: "row",
    width: "100%",
  },
  innerBox: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  left: {
    justifyContent: 'center',
    textAlign: "left",
  },
  right: {
    textAlign: "right",
    justifyContent: 'center',
  }
});

export class RowItem extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return(
      <View style={rowItemStyle.box}>
        <View style={[rowItemStyle.innerBox,this.props.innerBoxStyle]}>
          <View style={[rowItemStyle.left,this.props.leftItemStyle]}>
            {this.props.left}
          </View>
          <View style={[rowItemStyle.right,this.props.rightItemStyle]}>
            {this.props.right}
          </View>
        </View>
      </View>
    )
  }
}

RowItem.defaultProps = {
  innerBoxStyle: {
    marginLeft: 16,
    marginRight: 16,
  },
  leftItemStyle: {
    width: "50%",
  },
  rightItemStyle: {
    width: "50%",
  },
}
