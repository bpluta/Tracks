import React from 'react';
import { View, Text } from 'react-native';
import { Style } from '../style';
import { TaskIcon } from '../icons/task';
import { RoundedButton } from '../components/roundedButton';

export class EmptyScreen extends React.Component {
  constructor(props) {
    super(props)
  }

  infoStyle = {
    title: {
      color: Style.colors.primary,
      fontSize: 30,
      fontWeight: "600",
      textAlign: "center",
    },
    description: {
      fontSize: 15,
      color: Style.colors.primary,
      textAlign: "center",
      fontWeight: "400",
    },
  }

  render() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <TaskIcon
          fill={Style.colors.primary}
          width={150}
          height={150}
        />
        <View style={{width: 300, marginTop: 20}}>
          <Text style={this.infoStyle.title}>{this.props.title}</Text>
          <View style={{marginTop: 10}}>
          <Text style={this.infoStyle.description}>{this.props.description}</Text>
          </View>
        </View>
        <View style={{marginTop: 50}}>
        <RoundedButton
          rectStyle={{
            borderWidth: 1,
            width: 200,
            height: 40,
            backgroundColor: "transparent",
            borderColor: Style.colors.primary,
          }}
          textStyle={{
            color: Style.colors.primary
          }}
          text={this.props.buttonText}
          onPress={() => this.props.buttonOnPress()}
        />
        </View>
      </View>
    )
  }
}
