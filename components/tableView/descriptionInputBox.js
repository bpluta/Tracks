import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { RowItem } from './rowItem';
import { TableTitle } from './tableView';
import { Style } from '../../style';

const descriptionInputBoxStyle = StyleSheet.create({
  background: {
    backgroundColor: "transparent",
    width: "100%",
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  box: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "column",
    width: "100%",
  },
  innerBox: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: Style.colors.rowItemBackground,
  },
  text: {
    textAlign: "left",
    color: "#8E8E93",
    fontWeight: "400",
    fontFamily: "System",
  },
  innerText: {
    fontSize: 17,
    color: "#000000"
  },
  line: {
    borderBottomColor: "#ADADAD",
    borderBottomWidth: 1,
    width: "100%",
  },
});

const HorizontalLine = (props) => {
  return <View style={[descriptionInputBoxStyle.line, props.style]}/>
};

export class DescriptionInputBox extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={descriptionInputBoxStyle.background}>
        <View style={descriptionInputBoxStyle.box}>
          <TableTitle text={this.props.title} />
          <HorizontalLine />
          <View style={descriptionInputBoxStyle.innerBox}>
            <TextInput
              style={[descriptionInputBoxStyle.text,descriptionInputBoxStyle.innerText]}
              onChangeText={this.props.onChangeText}
              value={this.props.value}
              multiline = {true}
              numberOfLines = {4}
              maxLength = {this.props.maxLength}
            />
          </View>
          <HorizontalLine />
        </View>
      </View>

    )
  }
}

DescriptionInputBox.defaultProps = {
  numberOfLines: 4,
  maxLength: 300,
}

RowItem.defaultProps = {
  innerBoxStyle: {
    marginLeft: 16,
    marginRight: 16,
  },
}
