import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RowItem } from './rowItem';
import { TableTitle } from './tableView';
import { Style } from '../../style';

const descriptionBoxStyle = StyleSheet.create({
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
  },
  line: {
    borderBottomColor: "#ADADAD",
    borderBottomWidth: 1,
    width: "100%",
  },
});

const HorizontalLine = (props) => {
  return <View style={[descriptionBoxStyle.line, props.style]}/>
};

export class DescriptionBox extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={descriptionBoxStyle.background}>
        <View style={descriptionBoxStyle.box}>
          <TableTitle text={this.props.title} />
          <HorizontalLine />
          <View style={descriptionBoxStyle.innerBox}>
            <Text style={[descriptionBoxStyle.text,descriptionBoxStyle.innerText]}>
              {this.props.innerText}
            </Text>
          </View>
          <HorizontalLine />
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
}
