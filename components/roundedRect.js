import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

const roundedRectStyle = StyleSheet.create({
  rectStyle: {
    textAlign: "center",
  },
  textStyle: {
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "auto",
    marginBottom: "auto",
    textAlign: "center",
  }
})

export class RoundedRect extends React.Component {

  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={[roundedRectStyle.rectStyle,{borderRadius: this.props.rectStyle.height},this.props.rectStyle]}>
        <Text style={[roundedRectStyle.textStyle,this.props.textStyle]}>{this.props.text}</Text>
      </View>
    )
  }
}

RoundedRect.defaultProps = {
  rectStyle: {
    borderWidth: 1,
    width: 200,
    height: 40,
    backgroundColor: "transparent",
    borderColor: "black",
  },
  textStyle: {
    color: "black",
    fontSize: 16,
  },
  text: "RoundedRect",
}
