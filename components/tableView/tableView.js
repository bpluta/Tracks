import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { InfoRowItem } from './infoRowItem';

const tableViewStyle = StyleSheet.create( {
  line: {
    borderBottomColor: "#ADADAD",
    borderBottomWidth: 1,
  },
  item: {
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    textAlign: "left",
    color: "#8E8E93",
    fontWeight: "400",
    fontFamily: "System",
  },
  title: {
    textTransform: "uppercase",
    fontSize: 12,
  },
  titleBox: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 5,
  },
});

export const HorizontalLine = (props) => {
  return <View style={[tableViewStyle.line,props.style]}/>
};

export const TableTitle = (props) => {
  return (
    <View style={tableViewStyle.titleBox}>
      <Text style={[tableViewStyle.text,tableViewStyle.title]}>
        {props.text}
      </Text>
    </View>
  )
}

export class TableView extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View>
      <HorizontalLine style={{width: this.props.outerSeparatorWidth}} />
      { this.props.items.map(({type,...other},i,arr) => (
        <View style={tableViewStyle.item} key={i}>

        { React.createElement(type, {...other}) }
        { (i === arr.length-1) ? <HorizontalLine style={{width: this.props.outerSeparatorWidth}} /> : <HorizontalLine style={{width: this.props.innerSeparatorWidth}} /> }
        </View>
      )) }
      </View>

    )
  }
}

TableView.defaultProps = {
  outerSeparatorWidth: "100%",
  innerSeparatorWidth: "100%"
}
