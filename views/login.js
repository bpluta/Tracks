import React from 'react';
import { Text, View, TextInput, KeyboardAvoidingView, TouchableOpacity, Alert, AsyncStorage} from 'react-native';
import { RoundedInput } from '../components/roundedInput';
import { RoundedButton } from '../components/roundedButton';
import { Style } from '../style';
import { LogoIcon } from '../icons/logo';
import { login } from '../config/dataFetch';

export class LoginScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
   return {
     header: null,
   };
 };

 constructor(props) {
    super(props);
    this.state = {
      email: '',
      emailPlaceholder: 'email',
      password: '',
      passwordPlaceholder: 'password',
    };
  }

  handleLogin = () => {
    if (this.state.email == '') {
      Alert.alert("Oops","Please fill the email field to proceed");
    }
    else {
      login({email: this.state.email, password: this.state.password},
        (resp) => {
          if (resp.hasOwnProperty('message')) {
            if (resp.message === "Successfully logged in!") {
              this.props.navigation.navigate('Main');
            }
            else {
              Alert.alert("Oops",resp.message);
            }
          }
          else {
            this.props.navigation.navigate('Main');
          }
        }
      );
    }
  }

  handleEmail = (text) => {
      this.setState({ email: text.toString() })
  }

  handlePassword = (text) => {
      this.setState({ password: text.toString() })
  }

  navigateTo = (destination) => {
    this.props.navigation.navigate(destination);
  }

  test = async () => {
    var value = await AsyncStorage.getItem('IsLogged');
  }

  render() {
    this.test()
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
        <KeyboardAvoidingView behavior="position">
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
            <View style={{padding: 8}}>
              <RoundedInput
                placeholder={this.state.passwordPlaceholder}
                onChangeText={this.handlePassword}
                value={this.state.password}
                secureTextEntry={true}
              />
            </View>
            <TouchableOpacity onPress={() => this.navigateTo('Forgotten')}>
              <Text style={{color: Style.colors.secondaryText, marginBottom:13,textAlign: 'center', fontSize: 11}}>
                forgot your password?
              </Text>
            </TouchableOpacity>
            <View style={{padding: 8}}>
              <RoundedButton
                text="login"
                onPress={() => this.handleLogin()}
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
            <TouchableOpacity onPress={() => this.navigateTo('SignUp')}>
              <Text style={{margin: 5,color: Style.colors.secondaryText, textAlign: 'center', fontSize: 13}}>
                sign up
              </Text>
            </TouchableOpacity>

          </View>
        </KeyboardAvoidingView>
      </View>
    );
  }
}
