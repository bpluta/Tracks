import React from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';

const def = {
  inputHeight: 16,
  inputWidth: 200,
  fieldHeight: 40,
  fieldWidth: 240,
};

const roundedInputStyle = StyleSheet.create({
  borderStyle: {
    paddingLeft: ((def.fieldWidth-def.inputWidth)/2),
    paddingRight: ((def.fieldWidth-def.inputWidth)/2),
    width: def.fieldWidth,
    height: def.fieldHeight,
    borderRadius: def.fieldHeight,
    borderWidth: 1,
    borderColor: "#707070",
  },
  textInputStyle: {
    marginTop: "auto",
    marginBottom: "auto",
    fontSize: def.inputHeight,
  }
});

export class RoundedInput extends React.Component {

  constructor(props) {
    super(props);
  }
  render() {

    return (
      <View style={roundedInputStyle.borderStyle}>
        <TextInput style={roundedInputStyle.textInputStyle} {...this.props}/>
      </View>
    )
  }
}
