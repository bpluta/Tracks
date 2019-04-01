import React from 'react';
import { Text, View, TextInput, KeyboardAvoidingView, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { RoundedInput } from '../components/roundedInput';
import { RoundedButton } from '../components/roundedButton';
import { signUp, login } from '../config/dataFetch';
import { Style } from '../style';
import { LogoIcon } from '../icons/logo';

export class SignUpScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
   return {
     headerTitle: 'Sign Up',
     headerTintColor: Style.colors.primary,
   };
 }

 constructor(props) {
    super(props);
    this.state = {
      email: '',
      emailPlaceholder: 'email',
      password: '',
      passwordPlaceholder: 'password',
      confirmPassword: '',
      confirmPasswordPlaceholder: 'confirm password',
      firstNamePlaceholder: 'first name',
      firstName: '',
      surnamePlaceholder: 'last name',
      surname: '',
    };
  }

  handleSignUp = () => {
    if (this.state.email == '') {
      Alert.alert("Oops","Please fill the email field to proceed");
      this.setState({password: ''})
      this.setState({confirmPassword: ''})
    }
    else if (this.state.password == '' || this.state.confirmPassword == '') {
      Alert.alert("Oops","Please fill both of the password fields to proceed");
      this.setState({password: ''})
      this.setState({confirmPassword: ''})
    }
    else if (this.state.password != this.state.confirmPassword) {
      Alert.alert("Oops","It seems that the passwords do not match with each other. Please fill them again.");
      this.setState({password: ''})
      this.setState({confirmPassword: ''})
    }
    else {
      signUp({email: this.state.email, password: this.state.password, name: this.state.firstName, surname: this.state.surname},
        (resp) => {
          if (resp.hasOwnProperty('message')) {
            if (resp.message === "User successfully created!") {
              Alert.alert("Signed up!",resp.message);
              login({email: this.state.email, password: this.state.password},() => this.props.navigation.navigate('Main'));
            }
            else {
              Alert.alert("Oops",resp.message);
            }
          }
          else {
            Keyboard.dismiss;
            this.props.navigation.navigate('Main');
          }
        }
      );
    }
  }

  handleEmail = (text) => {
      this.setState({ email: text.toString() })
  }

  handleFirstName = (text) => {
      this.setState({ firstName: text.toString() })
  }

  handleSurname = (text) => {
      this.setState({ surname: text.toString() })
  }

  handlePassword = (text) => {
      this.setState({ password: text.toString() })
  }

  handleConfirmPassword = (text) => {
      this.setState({ confirmPassword: text.toString() })
  }

  handleDefaultWage = (text) => {
      if (/[0-9]*/.test(text)) {
        this.setState({ defaultWage: text.toString() })
      }
  }

  navigateTo = (destination) => {
    this.props.navigation.navigate(destination);
  }

  render() {
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

            <View style={{padding: 8}}>
              <RoundedInput
                placeholder={this.state.confirmPasswordPlaceholder}
                onChangeText={this.handleConfirmPassword}
                value={this.state.confirmPassword}
                secureTextEntry={true}
              />
            </View>
            <View style={{padding: 8}}>
              <RoundedInput
                placeholder={this.state.firstNamePlaceholder}
                onChangeText={this.handleFirstName}
                value={this.state.firstName}
                secureTextEntry={false}
              />
            </View>
            <View style={{padding: 8}}>
              <RoundedInput
                placeholder={this.state.surnamePlaceholder}
                onChangeText={this.handleSurname}
                value={this.state.surname}
                secureTextEntry={false}
              />
            </View>
            <View style={{paddingTop: 8, paddingBottom:100, alignItems: 'center'}}>
              <RoundedButton
                text="sign up"
                onPress={() => this.handleSignUp()}
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
