import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const projectWidgetStyle = StyleSheet.create({
      background: {
        width: 340,
        minHeight: 100,
        borderRadius: 15,
      },
      safeField: {
        flex: 1,
        justifyContent: 'flex-end',
        marginLeft: 25,
        marginRight: 25,
        marginTop: 20,
        marginBottom: 20,
        backgroundColor: "transparent",
      },
      titleLabel: {
        justifyContent: 'flex-end',
        color: "white",
        fontSize: 25,
        marginTop: "auto",
        fontWeight: "700",
      },
      line: {
        marginTop: 5,
        borderBottomWidth: 1,
      },
      subTitle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: "100%",
        backgroundColor: "transparent",
      },
      leftLabel: {
        fontSize: 17,
        color: "white",
        textAlign: "left",
        fontWeight: "500",
        fontFamily: 'System',
      },
      rightLabel: {
        fontSize: 17,
        color: "white",
        fontWeight: "700",
        textAlign: "right",
        fontFamily: 'System',
      }
    })

export class ProjectWidget extends React.Component {

  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={[projectWidgetStyle.background,{backgroundColor: this.props.faded ? "#9CB7C9" : "#257EB7"}]}>
        <View style={projectWidgetStyle.safeField}>
          <Text style={projectWidgetStyle.titleLabel}>{this.props.title}</Text>
          <View style={[projectWidgetStyle.line,{borderBottomColor: this.props.faded ? '#FFFFFF' : "#ADADAD"}]}/>
          <View style={projectWidgetStyle.subTitle}>
            <Text style={[projectWidgetStyle.leftLabel,this.props.leftLabelStyle]}>{this.props.leftLabel}</Text>
            <Text style={[projectWidgetStyle.rightLabel,this.props.rightLabelStyle]}>{this.props.rightLabel}</Text>
          </View>
        </View>
      </View>
    )
  }
}

ProjectWidget.defaultProps = {
  title: 'Aplikacja Tracks',
  leftLabel: '4 zadania',
  rightLabel: 'w trakcie',
  faded: false,
};
