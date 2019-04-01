import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Style } from '../style';
import { RowItem } from './tableView/rowItem';
import { RoundedRect } from './roundedRect';

const currentItemBarStyle = StyleSheet.create({
  box: {
    backgroundColor: Style.colors.primary,
  },
  leftItem: {
    paddingLeft: 20,
    color: Style.colors.contrastToPrimary,
    width: "65%"
  },
  rightItem: {
    paddingRight: 20,
    width: "35%"
  },
  title: {
    color: Style.colors.contrastToPrimary,
    fontWeight: "600",
    fontSize: 20,
  },
  subTitle: {
    color: Style.colors.contrastToPrimary,
    fontWeight: "500",
    fontSize: 16,
  }
});

export class CurrentItemBar extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (

      <View style={{width: "100%",height: 75}}>
      <RowItem
        innerBoxStyle={currentItemBarStyle.box}
        leftItemStyle={currentItemBarStyle.leftItem}
        rightItemStyle={currentItemBarStyle.rightItem}
        left={
          <View style={{flex:1, flexDirection: "column", justifyContent: "center"}}>
            <Text numberOfLines={1} ellipsizeMode="tail" style={currentItemBarStyle.title}>
              {this.props.title}
            </Text>
            <Text numberOfLines={1} ellipsizeMode="tail" style={currentItemBarStyle.subTitle}>
              {this.props.subtitle}
            </Text>
          </View>
        }
        right={
          <View>
            <RoundedRect
            text={this.props.rectText}
            rectStyle={{
              height: 33,
              alignSelf: 'flex-end',
              backgroundColor: this.props.rectColor,
            }}
            textStyle={{
              marginLeft: 15,
              marginRight: 15,
              fontWeight: "700",
              fontSize: 16,
              color: this.props.rectTextColor,
            }}
          />
          </View>
        }
      />
      </View>

    )
  }
}

CurrentItemBar.defaultProps = {
  rectText: "rect",
  rectColor: Style.colors.positive,
  rectTextColor: Style.colors.contrastToPrimary,
}
