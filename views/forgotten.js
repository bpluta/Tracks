import React from 'react';
import { Text, View, TextInput, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { RoundedInput } from '../components/roundedInput';
import { RoundedButton } from '../components/roundedButton';
import { resetPassword } from '../config/dataFetch';
import { Style } from '../style';
import { LogoIcon } from '../icons/logo';

export class ForgottenScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
   return {
     headerTitle: 'Reset Password',
     headerTintColor: Style.colors.primary,
   };
 };

 constructor(props) {
    super(props);
    this.state = {
      email: '',
      emailPlaceholder: 'email',
    };
  }

  handleForgotten = () => {
    if (this.state.email == '') {
      Alert.alert("Oops","Please fill the email field to proceed");
    }
    else {
      resetPassword({email: this.state.email},
        (resp) => {
          if (resp.hasOwnProperty('message')) {
            Alert.alert("Oops",resp.message);
          }
          else {
            Alert.alert("Oops","No message");
          }
        }
      );
    }
  }

  handleEmail = (text) => {
      this.setState({ email: text.toString() })
  }

  navigateTo = (destination) => {
    this.props.navigation.navigate(destination);
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
        <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset="100">
          <View>
            <View style={{alignItems: 'center' }}>
              <LogoIcon width="150" height="150" fill={Style.colors.primary} style={{marginBottom: 30}} />
            </View>
            <View style={{padding: 8}}>
              <RoundedInput
                placeholder={this.state.emailPlaceholder}
                onChangeText={this.handleEmail}
                value={this.state.email}
                autoCorrect={false}
                autoCapitalize={"none"}
              />
            </View>
            <View style={{padding: 8, marginBottom: 100}}>
              <RoundedButton
                text="reset password"
                onPress={() => this.handleForgotten()}
                rectStyle={{
                  width: Style.login.input.width,
                  height: Style.login.input.height,
                  backgroundColor: Style.colors.primary,
                }}
                textStyle={{
                  color: Style.colors.contrastToPrimary,
                  fontSize: 16,
                }}
                />
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  }
}
