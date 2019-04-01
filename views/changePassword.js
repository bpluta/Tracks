import React from 'react';
import { ScrollView , Text, SafeAreaView, View, Picker, AsyncStorage, Keyboard, TouchableOpacity, Alert } from 'react-native';
import { NavigationEvents } from "react-navigation";
import { NavigationActions, StackActions } from 'react-navigation';
import { RoundedButton } from '../components/roundedButton';
import { InputRowItem } from '../components/tableView/inputRowItem';
import { TableView } from '../components/tableView/tableView';
import { InfoRowItem } from '../components/tableView/infoRowItem';
import { TableTitle } from '../components/tableView/tableView';
import { TouchableInfoRowItem } from '../components/tableView/touchableInfoRowItem';
import { Style } from '../style';

export class ChangePasswordScreen extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    }
  }

  static navigationOptions = ({ navigation }) => {
   return {
     headerTintColor: Style.colors.primary,
   };
  };

  resetStack(payload) {
    this.props.navigation.dispatch(
      StackActions.reset({
        index: 0,
        key: String(payload.action.routeName),
        actions: [
          NavigationActions.navigate({
            routeName: payload.action.routeName,
          })
        ]
    }));
  };

  render() {
      return (
          <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Style.colors.settingsBackground }}>
            <NavigationEvents
              onWillFocus={payload => {
                this.resetStack(payload);
              }}
              onWillBlur={() => {
              }}
            />

            <ScrollView automaticallyAdjustContentInsets={false}>
              <View style={{marginTop: 20}}>
                <TableView items={[
                  {type: InputRowItem, left: "Old password", right: user.oldPassword, secureTextEntry: true, rightItemStyle: {width: "70%"}, onChangeText: ((password) => { this.setState({oldPassword: password}) })},
                  {type: InputRowItem, left: "New password", right: user.newPassword, secureTextEntry: true, rightItemStyle: {width: "70%"}, onChangeText: ((password) => { this.setState({newPassword: password}) })},
                  {type: InputRowItem, left: "Confirm password", right: user.confirmNewPassword, secureTextEntry: true,  rightItemStyle: {width: "60%"}, onChangeText: ((password) => { this.setState({confirmNewPassword: password}) })},
                ]}/>
              </View>

              <View style={{marginTop: 25, marginBottom: 25, justifyContent: 'center', alignItems: 'center'}}>
                <View style={{paddingTop:5, paddingBottom:5}}>
                  <RoundedButton
                    rectStyle={{width: 215, height: 42, borderWidth: 1, borderColor: Style.colors.neutralButton}}
                    textStyle={{fontSize: 15, color: Style.colors.neutralButton}}
                    text="change password"/>
                </View>
              </View>
            </ScrollView>
          </SafeAreaView>
        );
  }
}

const ArrowRight = () => <Icon name="ios-arrow-forward" size={22} />;
const RightButton = () => (
  <Button onPress={() => alert('Hello world!')}>
    <ArrowRight />
  </Button>
);
