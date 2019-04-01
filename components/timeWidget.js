import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const timeWidgetStyle = StyleSheet.create({
  background: {
    width: 340,
    height: 130,
    backgroundColor: "#257EB7",
    borderRadius: 10,
  },
  safeField: {
    marginLeft: 25,
    marginRight: 25,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "transparent",
  },
  headerLabel: {
    color: "white",
    fontSize: 18,
    marginTop: "auto",
    marginBottom: "auto",
    fontWeight: "600",
  },
  line: {
    marginTop: 5,
    marginBottom: 5,
    borderBottomColor: '#ADADAD',
    borderBottomWidth: 1,
  },
  mainLabel: {
    fontSize: 40,
    color: "white",
    textAlign: "right",
    fontWeight: "700",
  },
  secondLabel: {
    fontSize: 30,
    color: "white",
    fontWeight: "600",
    textAlign: "right",
  }
})

export class TimeWidget extends React.Component {

  constructor(props) {
    super(props);

  }
  render() {
    return (
      <View style={timeWidgetStyle.background}>
        <View style={timeWidgetStyle.safeField}>
          <Text style={timeWidgetStyle.headerLabel}>{this.props.title}</Text>
          <View style={timeWidgetStyle.line}/>
          <Text style={timeWidgetStyle.mainLabel}>{this.props.main}</Text>
          <Text style={timeWidgetStyle.secondLabel}>{this.props.second}</Text>
        </View>
      </View>
    )
  }
}

TimeWidget.defaultProps = {
  title: 'spędzony czas',
  main: '14h 26min',
  second: '433 PLN',
};
